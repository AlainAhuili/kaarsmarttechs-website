"""The contact form. The WordPress contact page posts to /api/contact as a plain HTML form; the
answer is a redirect back to the page with the outcome in the query string, so the page needs no
session, cookie or script. Clients that ask for JSON get JSON and real status codes instead."""

import hashlib
import hmac
import re
from datetime import UTC, datetime, timedelta
from typing import Annotated
from urllib.parse import urlsplit

from fastapi import APIRouter, Form, Request
from fastapi.responses import JSONResponse, RedirectResponse, Response
from sqlalchemy import Connection, Engine, delete, func, insert, select

from . import db
from .config import Settings

router = APIRouter()

# Per visitor, like the Laravel version: 3 per minute and 20 per day.
LIMITS = ((timedelta(minutes=1), 3), (timedelta(days=1), 20))
_EMAIL = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")


def now() -> datetime:
    return datetime.now(UTC).replace(tzinfo=None, microsecond=0)


def validate(name: str, email: str, company: str, message: str) -> dict[str, str]:
    errors = {}
    if not name or len(name) > 100:
        errors["name"] = "Please enter your name (up to 100 characters)."
    if len(email) > 254 or not _EMAIL.match(email):
        errors["email"] = "Please enter a valid email address."
    if len(company) > 100:
        errors["company"] = "Please shorten the company name to 100 characters."
    if not 10 <= len(message) <= 5000:
        errors["message"] = "Please write between 10 and 5000 characters."
    return errors


def client_ip(request: Request, hops: int) -> str:
    """The address the outermost trusted proxy saw. Each proxy appends to X-Forwarded-For, so
    entries further left than `hops` can be forged by the client and are ignored."""
    forwarded = [p.strip() for p in request.headers.get("x-forwarded-for", "").split(",") if p.strip()]
    if hops > 0 and len(forwarded) >= hops:
        return forwarded[-hops]
    return request.client.host if request.client else "unknown"


def same_origin(request: Request) -> bool:
    """Rejects forms posted from other sites. Requests without Origin/Referer (e.g. curl) pass."""
    source = request.headers.get("origin") or request.headers.get("referer")
    if source is None:
        return True
    return urlsplit(source).netloc == request.headers.get("host")


def rate_limited(conn: Connection, visitor: str, at: datetime) -> bool:
    for window, limit in LIMITS:
        count = conn.scalar(
            select(func.count())
            .select_from(db.contact_attempts)
            .where(db.contact_attempts.c.visitor == visitor, db.contact_attempts.c.created_at > at - window)
        )
        if count >= limit:
            return True
    return False


def prune(engine: Engine, retention_days: int) -> None:
    """Deletes messages past the retention period and attempts older than the longest limit."""
    at = now()
    with engine.begin() as conn:
        conn.execute(
            delete(db.contact_messages).where(
                db.contact_messages.c.created_at < at - timedelta(days=retention_days)
            )
        )
        conn.execute(delete(db.contact_attempts).where(db.contact_attempts.c.created_at < at - LIMITS[-1][0]))


def _answer(request: Request, outcome: str, errors: dict[str, str] | None = None) -> Response:
    accept = request.headers.get("accept", "")
    if "application/json" in accept and "text/html" not in accept:
        status = {"sent": 201, "invalid": 422, "rate-limited": 429, "forbidden": 403}[outcome]
        return JSONResponse({"status": outcome, "errors": errors or {}}, status_code=status)
    query = "sent=1" if outcome == "sent" else f"error={outcome}"
    if errors:
        query += "&fields=" + ",".join(errors)
    return RedirectResponse(f"/contact/?{query}#contact-form", status_code=303)


@router.post("/api/contact")
def submit(
    request: Request,
    name: Annotated[str, Form()] = "",
    email: Annotated[str, Form()] = "",
    company: Annotated[str, Form()] = "",
    message: Annotated[str, Form()] = "",
    website: Annotated[str, Form()] = "",  # honeypot, hidden from people
) -> Response:
    settings: Settings = request.app.state.settings
    engine: Engine = request.app.state.engine

    if not same_origin(request):
        return _answer(request, "forbidden")

    at = now()
    ip = client_ip(request, settings.trusted_proxy_hops)
    visitor = hmac.new(settings.secret.encode(), ip.encode(), hashlib.sha256).hexdigest()
    with engine.begin() as conn:
        if rate_limited(conn, visitor, at):
            return _answer(request, "rate-limited")
        conn.execute(insert(db.contact_attempts).values(visitor=visitor, created_at=at))

    name, email, company, message = (v.strip() for v in (name, email, company, message))
    if errors := validate(name, email, company, message):
        return _answer(request, "invalid", errors)

    # Bots fill the hidden "website" field; they get the same answer but nothing is stored.
    if not website:
        with engine.begin() as conn:
            conn.execute(
                insert(db.contact_messages).values(
                    name=name, email=email, company=company or None, message=message, created_at=at
                )
            )
    return _answer(request, "sent")
