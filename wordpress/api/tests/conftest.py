import os
from dataclasses import replace

import pytest
from fastapi.testclient import TestClient

from app import config, db
from app.main import create_app
from app.projects import load_dir
from app.sync import sync_projects


@pytest.fixture
def settings() -> config.Settings:
    # SQLite in memory by default; CI sets TEST_DATABASE_URL to run against MariaDB.
    return replace(
        config.load(),
        database_url=os.environ.get("TEST_DATABASE_URL", "sqlite://"),
        secret="test-secret",
        trusted_proxy_hops=1,
        version="test",
    )


@pytest.fixture
def app(settings):
    app = create_app(settings, prune_in_background=False)
    engine = app.state.engine
    db.metadata.drop_all(engine)
    db.metadata.create_all(engine)
    sync_projects(engine, load_dir(settings.projects_path))
    yield app
    db.metadata.drop_all(engine)


@pytest.fixture
def engine(app):
    return app.state.engine


@pytest.fixture
def client(app):
    # base_url host matches the Host header that same-origin checks compare against.
    with TestClient(app, base_url="http://testserver", follow_redirects=False) as client:
        yield client
