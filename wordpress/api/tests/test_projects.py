import pytest

from app.projects import InvalidProject, category_slug, load_dir, parse, sort_key

VALID = """---
title: Test Project
tagline: A short tagline.
status: Internal
categories: ["Cloud & DevOps"]
order: 2
problem: Something is slow.
stack: ["Python"]
metrics:
  - label: Speed
  - label: Accuracy
    value: 99 %
---

## Body

Some *text* with <script>alert(1)</script> and a [bad link](javascript:alert(1)).
"""


def entry(**changes: str) -> str:
    text = VALID
    for key, value in changes.items():
        start = text.index(f"\n{key}:") + 1
        end = text.index("\n", start)
        text = text[:start] + f"{key}: {value}" + text[end:]
    return text


def test_valid_entry_is_parsed_with_defaults():
    row = parse("test-project", VALID)

    assert row["title"] == "Test Project"
    assert row["flagship"] is False
    assert row["sort_order"] == 2
    assert row["metrics"] == [{"label": "Speed", "value": None}, {"label": "Accuracy", "value": "99 %"}]
    assert "<h2>Body</h2>" in row["body_html"]


def test_raw_html_and_unsafe_links_in_the_body_are_not_rendered():
    html = parse("test-project", VALID)["body_html"]

    assert "<script>" not in html
    assert "&lt;script&gt;" in html
    assert 'href="javascript:' not in html


@pytest.mark.parametrize(
    "changes",
    [
        {"status": "Finished"},
        {"categories": '["Cloud & DevOps", "Code Quality", "Computer Vision", "Embedded Systems"]'},
        {"categories": '["Gardening"]'},
        {"categories": "[]"},
        {"stack": "[]"},
        {"title": "X"},
        {"order": "first"},
        {"tagline": "x" * 141},
    ],
)
def test_entries_breaking_the_astro_schema_are_rejected(changes):
    with pytest.raises(InvalidProject):
        parse("test-project", entry(**changes))


def test_unknown_fields_and_missing_front_matter_are_rejected():
    with pytest.raises(InvalidProject):
        parse("test-project", VALID.replace("order: 2", "order: 2\nprice: 10"))
    with pytest.raises(InvalidProject):
        parse("test-project", "## No front matter")


def test_file_names_must_be_slugs():
    with pytest.raises(InvalidProject):
        parse("Test Project", VALID)


def test_category_slug_matches_the_astro_helper():
    assert category_slug("Cloud & DevOps") == "cloud-devops"
    assert category_slug("AI & Agentic Tooling") == "ai-agentic-tooling"


def test_every_entry_in_the_repository_is_valid(settings):
    rows = load_dir(settings.projects_path)

    assert len(rows) >= 5
    assert sum(r["flagship"] for r in rows) == 1
    assert sorted(rows, key=sort_key)[0]["slug"] == "lego-sorting-system"
