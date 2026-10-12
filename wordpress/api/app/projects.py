"""Project entries: YAML front matter + Markdown body, validated with the same rules as the Astro
content schema in src/content.config.ts."""

import re
from pathlib import Path
from typing import Annotated, Literal

import yaml
from markdown_it import MarkdownIt
from pydantic import BaseModel, ConfigDict, Field, StringConstraints, ValidationError

# Keep in sync with src/lib/projects.ts.
STATUSES = ("In development", "Internal", "Client work")
CATEGORIES = (
    "Computer Vision",
    "Embedded Systems",
    "Cloud & DevOps",
    "AI & Agentic Tooling",
    "Code Quality",
)

Status = Literal["In development", "Internal", "Client work"]
Category = Literal[
    "Computer Vision", "Embedded Systems", "Cloud & DevOps", "AI & Agentic Tooling", "Code Quality"
]

_FRONT_MATTER = re.compile(r"\A---\r?\n(.*?)\r?\n---(?:\r?\n)?(.*)\Z", re.S)
_SLUG = re.compile(r"^[a-z0-9]+(?:-[a-z0-9]+)*$")
# CommonMark with raw HTML disabled: entries come from the repository, but HTML is still escaped.
_markdown = MarkdownIt("commonmark", {"html": False})


class Metric(BaseModel):
    model_config = ConfigDict(extra="forbid")
    label: str
    value: str | None = None


class FrontMatter(BaseModel):
    model_config = ConfigDict(extra="forbid")
    title: Annotated[str, StringConstraints(min_length=2, max_length=60)]
    tagline: Annotated[str, StringConstraints(max_length=140)]
    status: Status
    categories: Annotated[list[Category], Field(min_length=1, max_length=3)]
    flagship: bool = False
    order: int
    problem: str
    stack: Annotated[list[str], Field(min_length=1)]
    # Only measured numbers are published; a missing value renders as "Measuring".
    metrics: list[Metric] = []


class InvalidProject(ValueError):
    pass


def category_slug(category: str) -> str:
    """URL-safe tag used by the client-side filter, e.g. "Cloud & DevOps" -> "cloud-devops"."""
    return re.sub(r"[^a-z0-9]+", "-", category.lower().replace("&", " ")).strip("-")


def parse(slug: str, text: str) -> dict:
    """Returns the row for the projects table, or raises InvalidProject."""
    if not _SLUG.match(slug):
        raise InvalidProject(f"{slug}: file name must be a lowercase slug")
    match = _FRONT_MATTER.match(text)
    if not match:
        raise InvalidProject(f"{slug}: missing front matter")
    try:
        data = FrontMatter.model_validate(yaml.safe_load(match.group(1)) or {})
    except (yaml.YAMLError, ValidationError) as e:
        raise InvalidProject(f"{slug}: {e}") from e

    return {
        "slug": slug,
        "title": data.title,
        "tagline": data.tagline,
        "status": data.status,
        "categories": data.categories,
        "flagship": data.flagship,
        "sort_order": data.order,
        "problem": data.problem,
        "stack": data.stack,
        "metrics": [m.model_dump() for m in data.metrics],
        "body_html": _markdown.render(match.group(2).strip()),
    }


def load_dir(path: Path) -> list[dict]:
    files = sorted(path.glob("*.md"))
    if not files:
        raise InvalidProject(f"No project files found in {path}")
    return [parse(f.stem, f.read_text(encoding="utf-8")) for f in files]


def sort_key(row: dict) -> tuple:
    """Flagship first, then by explicit order, then by slug for a stable result."""
    return (not row["flagship"], row["sort_order"], row["slug"])


def to_json(row: dict) -> dict:
    return {
        "slug": row["slug"],
        "title": row["title"],
        "tagline": row["tagline"],
        "status": row["status"],
        "categories": row["categories"],
        "category_slugs": [category_slug(c) for c in row["categories"]],
        "flagship": bool(row["flagship"]),
        "order": row["sort_order"],
        "problem": row["problem"],
        "stack": row["stack"],
        "metrics": row["metrics"],
        "body_html": row["body_html"],
    }
