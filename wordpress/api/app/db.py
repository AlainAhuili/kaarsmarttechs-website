"""Schema of the API database (separate from WordPress's database on the same MariaDB server)."""

from sqlalchemy import (
    JSON,
    Boolean,
    Column,
    DateTime,
    Engine,
    Index,
    Integer,
    MetaData,
    String,
    Table,
    Text,
    create_engine,
)
from sqlalchemy.dialects.mysql import MEDIUMTEXT
from sqlalchemy.engine import URL

metadata = MetaData()

# Synced from src/content/projects by `python -m app.sync`; read by the WordPress theme.
projects = Table(
    "projects",
    metadata,
    Column("slug", String(100), primary_key=True),
    Column("title", String(60), nullable=False),
    Column("tagline", String(140), nullable=False),
    Column("status", String(40), nullable=False),
    Column("categories", JSON, nullable=False),
    Column("flagship", Boolean, nullable=False, default=False),
    Column("sort_order", Integer, nullable=False),
    Column("problem", Text, nullable=False),
    Column("stack", JSON, nullable=False),
    Column("metrics", JSON, nullable=False),
    Column("body_html", Text().with_variant(MEDIUMTEXT(), "mysql", "mariadb"), nullable=False),
    mysql_charset="utf8mb4",
)

contact_messages = Table(
    "contact_messages",
    metadata,
    Column("id", Integer, primary_key=True, autoincrement=True),
    Column("name", String(100), nullable=False),
    Column("email", String(254), nullable=False),
    Column("company", String(100), nullable=True),
    Column("message", Text, nullable=False),
    Column("created_at", DateTime, nullable=False, index=True),
    mysql_charset="utf8mb4",
)

# One row per submission attempt, keyed by a keyed hash of the visitor's IP address and kept
# for one day. Stored apart from the messages, so a message cannot be linked to an address.
contact_attempts = Table(
    "contact_attempts",
    metadata,
    Column("id", Integer, primary_key=True, autoincrement=True),
    Column("visitor", String(64), nullable=False),
    Column("created_at", DateTime, nullable=False),
    Index("ix_contact_attempts_visitor_created_at", "visitor", "created_at"),
    mysql_charset="utf8mb4",
)


def make_engine(url: str | URL) -> Engine:
    if str(url).startswith("sqlite"):
        from sqlalchemy.pool import StaticPool

        # One shared in-memory database for tests.
        return create_engine(url, connect_args={"check_same_thread": False}, poolclass=StaticPool)
    return create_engine(url, pool_pre_ping=True, pool_recycle=3600)
