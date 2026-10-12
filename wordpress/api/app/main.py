"""FastAPI service behind nginx at /api/: serves the project entries to the WordPress theme and
stores contact form messages. Run with:

    uvicorn --factory app.main:create_app --host 0.0.0.0 --port 8000
"""

import asyncio
import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse
from sqlalchemy import select, text

from . import config, contact, db
from .projects import CATEGORIES, sort_key, to_json

log = logging.getLogger("api")
PRUNE_INTERVAL_SECONDS = 6 * 3600


def create_app(settings: config.Settings | None = None, prune_in_background: bool = True) -> FastAPI:
    settings = settings or config.load()
    engine = db.make_engine(settings.database_url)

    async def prune_forever() -> None:
        # Every replica prunes; the deletes are idempotent, so no coordination is needed.
        while True:
            try:
                await asyncio.to_thread(contact.prune, engine, settings.contact_retention_days)
            except Exception:
                log.exception("Pruning contact data failed")
            await asyncio.sleep(PRUNE_INTERVAL_SECONDS)

    @asynccontextmanager
    async def lifespan(app: FastAPI):
        if not settings.secret:
            raise RuntimeError("API_SECRET must be set")
        task = asyncio.create_task(prune_forever()) if prune_in_background else None
        yield
        if task:
            task.cancel()
        engine.dispose()

    # No interactive docs: they load assets from a CDN, which the site's CSP and GDPR rules forbid.
    app = FastAPI(
        title="kaarsmarttechs.com API", lifespan=lifespan, docs_url=None, redoc_url=None, openapi_url=None
    )
    app.state.settings = settings
    app.state.engine = engine
    app.include_router(contact.router)

    @app.get("/api/health")
    def health() -> JSONResponse:
        try:
            with engine.connect() as conn:
                conn.execute(text("SELECT 1"))
        except Exception:
            log.exception("Health check failed")
            return JSONResponse({"status": "unavailable"}, status_code=503)
        return JSONResponse({"status": "ok", "version": settings.version})

    def all_projects() -> list[dict]:
        with engine.connect() as conn:
            rows = [dict(r._mapping) for r in conn.execute(select(db.projects))]
        return sorted(rows, key=sort_key)

    @app.get("/api/projects")
    def list_projects() -> dict:
        return {"categories": list(CATEGORIES), "projects": [to_json(r) for r in all_projects()]}

    @app.get("/api/projects/{slug}")
    def get_project(slug: str) -> dict:
        for row in all_projects():
            if row["slug"] == slug:
                return to_json(row)
        raise HTTPException(status_code=404, detail="Project not found")

    return app
