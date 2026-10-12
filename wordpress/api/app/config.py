"""Settings, read once from the environment."""

import os
from dataclasses import dataclass
from pathlib import Path

from sqlalchemy.engine import URL

# The Markdown project entries shared with the Astro site. The image copies them to /srv/content.
_REPO_PROJECTS = Path(__file__).resolve().parents[3] / "src" / "content" / "projects"


@dataclass(frozen=True)
class Settings:
    database_url: str | URL
    projects_path: Path
    # Contact messages are deleted after this many days (see the privacy policy).
    contact_retention_days: int
    # Keys the hash of visitor IP addresses used for rate limiting; the address itself is never stored.
    secret: str
    # Proxies in front of the API that append to X-Forwarded-For: 1 = nginx, 2 = ingress + nginx.
    trusted_proxy_hops: int
    version: str


def load() -> Settings:
    env = os.environ
    database_url: str | URL = env.get("DATABASE_URL") or URL.create(
        "mysql+pymysql",
        username=env.get("DB_USERNAME", "api"),
        password=env.get("DB_PASSWORD", ""),
        host=env.get("DB_HOST", "127.0.0.1"),
        port=int(env.get("DB_PORT", "3306")),
        database=env.get("DB_DATABASE", "api"),
        query={"charset": "utf8mb4"},
    )
    return Settings(
        database_url=database_url,
        projects_path=Path(env.get("PROJECTS_PATH", str(_REPO_PROJECTS))),
        contact_retention_days=int(env.get("CONTACT_RETENTION_DAYS", "180")),
        secret=env.get("API_SECRET", ""),
        trusted_proxy_hops=int(env.get("TRUSTED_PROXY_HOPS", "1")),
        version=env.get("VERSION", "dev"),
    )
