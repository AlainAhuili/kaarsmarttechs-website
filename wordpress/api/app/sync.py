"""Creates the schema and syncs the projects table with the Markdown entries: creates and updates
by slug and removes projects whose file was deleted. Safe to run on every deployment:

    python -m app.sync
"""

import sys

from sqlalchemy import Engine, delete, insert, select, update

from . import config, db
from .projects import InvalidProject, load_dir


def sync_projects(engine: Engine, entries: list[dict]) -> int:
    with engine.begin() as conn:
        existing = set(conn.scalars(select(db.projects.c.slug)))
        for entry in entries:
            if entry["slug"] in existing:
                conn.execute(update(db.projects).where(db.projects.c.slug == entry["slug"]).values(entry))
            else:
                conn.execute(insert(db.projects).values(entry))
        conn.execute(delete(db.projects).where(db.projects.c.slug.not_in([e["slug"] for e in entries])))
    return len(entries)


def main() -> int:
    settings = config.load()
    try:
        entries = load_dir(settings.projects_path)
    except InvalidProject as e:
        print(f"Invalid project entry: {e}", file=sys.stderr)
        return 1
    engine = db.make_engine(settings.database_url)
    db.metadata.create_all(engine)
    print(f"{sync_projects(engine, entries)} projects synced.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
