#!/usr/bin/env python3
"""The Astro post-build quality gate (tests/dist/site.test.ts), run against the running WordPress
stack. Standard library only.

    python3 wordpress/tests/site_check.py http://localhost:8082
"""

import re
import sys
import urllib.error
import urllib.request

PAGES = [
    "/",
    "/services/",
    "/projects/",
    "/projects/lego-sorting-system/",
    "/contact/",
    "/impressum/",
    "/datenschutz/",
]


class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, *args, **kwargs):
        return None


opener = urllib.request.build_opener(NoRedirect)


def fetch(url: str) -> tuple[int, dict[str, str], str]:
    try:
        with opener.open(url, timeout=10) as r:
            return r.status, dict(r.headers), r.read().decode("utf-8", "replace")
    except urllib.error.HTTPError as e:
        return e.code, dict(e.headers), e.read().decode("utf-8", "replace")


def check_page(base: str, path: str, html: str, headers: dict[str, str]) -> list[str]:
    errors = []
    if '<html lang="en"' not in html:
        errors.append("missing <html lang>")
    if not re.search(r"<title>[^<]{5,}</title>", html):
        errors.append("missing title")
    if not re.search(r'<meta name="description" content="[^"]{30,}"', html):
        errors.append("missing or short meta description")
    if (h1 := len(re.findall(r"<h1[\s>]", html))) != 1:
        errors.append(f"{h1} h1 elements")
    for legal in ('href="/impressum/"', 'href="/datenschutz/"'):
        if legal not in html:
            errors.append(f"no link {legal}")
    if inline := re.findall(r"<script(?![^>]*\ssrc=)[^>]*>", html):
        errors.append(f"inline scripts (blocked by the CSP): {inline}")
    external = [
        url
        for url in re.findall(r'<(?:script|link|img|iframe)[^>]+(?:src|href)="(https?://[^"]+)"', html)
        if not url.startswith(base)
    ]
    if external:
        errors.append(f"third-party resources: {external}")
    if any(k.lower() == "set-cookie" for k in headers):
        errors.append("sets a cookie")
    return errors


def main(base: str) -> int:
    base = base.rstrip("/")
    failed = False
    links: set[str] = set()

    for path in PAGES:
        status, headers, html = fetch(base + path)
        errors = [f"status {status}"] if status != 200 else check_page(base, path, html, headers)
        links.update(re.findall(r'(?:href|src)="(/[^"#?]*)', html))
        print(("FAIL" if errors else "PASS") + f"  {path}" + (": " + "; ".join(errors) if errors else ""))
        failed |= bool(errors)

    broken = [f"{link} ({status})" for link in sorted(links) if (status := fetch(base + link)[0]) != 200]
    print(f"FAIL  broken internal links: {broken}" if broken else f"PASS  {len(links)} internal links")
    failed |= bool(broken)

    status, _, html = fetch(base + "/this-page-does-not-exist/")
    ok = status == 404 and "This page fell off the belt." in html
    print(("PASS" if ok else "FAIL") + "  unknown page returns 404 with the site layout")
    failed |= not ok

    return int(failed)


if __name__ == "__main__":
    sys.exit(main(sys.argv[1] if len(sys.argv) > 1 else "http://localhost:8082"))
