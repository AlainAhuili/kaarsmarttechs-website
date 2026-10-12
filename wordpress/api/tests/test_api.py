from datetime import timedelta

from sqlalchemy import func, insert, select

from app import contact, db
from app.projects import load_dir
from app.sync import sync_projects

MESSAGE = {
    "name": "Ada Example",
    "email": "ada@example.com",
    "company": "Example GmbH",
    "message": "We need a camera that counts parts on our line.",
}
JSON = {"accept": "application/json"}


def count(engine, table) -> int:
    with engine.connect() as conn:
        return conn.scalar(select(func.count()).select_from(table))


def test_health_reports_version(client):
    assert client.get("/api/health").json() == {"status": "ok", "version": "test"}


def test_projects_are_listed_flagship_first(client):
    body = client.get("/api/projects").json()

    assert body["categories"][0] == "Computer Vision"
    assert body["projects"][0]["slug"] == "lego-sorting-system"
    assert body["projects"][0]["flagship"] is True
    assert [p["order"] for p in body["projects"][1:]] == sorted(p["order"] for p in body["projects"][1:])
    assert "cloud-devops" in body["projects"][0]["category_slugs"]


def test_single_project_and_unknown_slug(client):
    project = client.get("/api/projects/lego-sorting-system").json()

    assert project["title"] == "Automated LEGO Sorting System"
    assert {"label": "Bricks per minute", "value": None} in project["metrics"]
    assert client.get("/api/projects/does-not-exist").status_code == 404


def test_sync_updates_and_removes_entries(engine, settings):
    rows = load_dir(settings.projects_path)
    changed = {**rows[0], "title": "Renamed"}

    sync_projects(engine, [changed])

    with engine.connect() as conn:
        assert list(conn.execute(select(db.projects.c.slug, db.projects.c.title))) == [
            (changed["slug"], "Renamed")
        ]


def test_valid_message_is_stored_and_redirects_to_the_confirmation(client, engine):
    response = client.post("/api/contact", data=MESSAGE)

    assert response.status_code == 303
    assert response.headers["location"] == "/contact/?sent=1#contact-form"
    with engine.connect() as conn:
        row = conn.execute(select(db.contact_messages)).one()
    assert (row.email, row.company) == ("ada@example.com", "Example GmbH")


def test_json_clients_get_status_codes(client):
    assert client.post("/api/contact", data=MESSAGE, headers=JSON).status_code == 201
    invalid = client.post("/api/contact", data={**MESSAGE, "email": "nope"}, headers=JSON)
    assert invalid.status_code == 422
    assert list(invalid.json()["errors"]) == ["email"]


def test_company_is_optional(client, engine):
    client.post("/api/contact", data={**MESSAGE, "company": ""})

    with engine.connect() as conn:
        assert conn.scalar(select(db.contact_messages.c.company)) is None


def test_invalid_message_is_rejected_with_field_errors(client, engine):
    response = client.post("/api/contact", data={"name": "", "email": "not-an-email", "message": "short"})

    assert response.headers["location"] == "/contact/?error=invalid&fields=name,email,message#contact-form"
    assert count(engine, db.contact_messages) == 0


def test_honeypot_submission_is_answered_but_not_stored(client, engine):
    response = client.post("/api/contact", data={**MESSAGE, "website": "https://spam.example"})

    assert response.headers["location"] == "/contact/?sent=1#contact-form"
    assert count(engine, db.contact_messages) == 0


def test_submissions_are_rate_limited_per_visitor(client, engine):
    for _ in range(3):
        assert client.post("/api/contact", data=MESSAGE, headers=JSON).status_code == 201

    assert client.post("/api/contact", data=MESSAGE, headers=JSON).status_code == 429
    # Another visitor (a different address appended by nginx) is not affected.
    other = {**JSON, "x-forwarded-for": "203.0.113.9"}
    assert client.post("/api/contact", data=MESSAGE, headers=other).status_code == 201
    assert count(engine, db.contact_messages) == 4


def test_forged_forwarded_for_entries_do_not_bypass_the_limit(client):
    for i in range(3):
        client.post(
            "/api/contact", data=MESSAGE, headers={**JSON, "x-forwarded-for": f"10.0.0.{i}, 203.0.113.9"}
        )

    forged = {**JSON, "x-forwarded-for": "10.0.0.99, 203.0.113.9"}
    assert client.post("/api/contact", data=MESSAGE, headers=forged).status_code == 429


def test_no_ip_address_is_stored(client, engine):
    client.post("/api/contact", data=MESSAGE, headers={"x-forwarded-for": "203.0.113.9"})

    with engine.connect() as conn:
        visitors = list(conn.scalars(select(db.contact_attempts.c.visitor)))
    assert len(visitors) == 1 and "203.0.113.9" not in visitors[0]


def test_forms_posted_from_other_sites_are_rejected(client, engine):
    response = client.post("/api/contact", data=MESSAGE, headers={**JSON, "origin": "https://evil.example"})

    assert response.status_code == 403
    assert (
        client.post("/api/contact", data=MESSAGE, headers={"origin": "http://testserver"}).status_code == 303
    )
    assert count(engine, db.contact_messages) == 1


def test_messages_past_retention_and_old_attempts_are_pruned(engine, settings):
    now = contact.now()
    old = now - timedelta(days=settings.contact_retention_days + 1)
    with engine.begin() as conn:
        for created_at, email in ((old, "old@example.com"), (now, "recent@example.com")):
            conn.execute(
                insert(db.contact_messages).values({**MESSAGE, "email": email, "created_at": created_at})
            )
        conn.execute(insert(db.contact_attempts).values(visitor="x", created_at=now - timedelta(days=2)))

    contact.prune(engine, settings.contact_retention_days)

    with engine.connect() as conn:
        assert list(conn.scalars(select(db.contact_messages.c.email))) == ["recent@example.com"]
    assert count(engine, db.contact_attempts) == 0
