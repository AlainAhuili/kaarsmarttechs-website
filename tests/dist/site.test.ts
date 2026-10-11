// Post-build quality gate: runs against ./dist after `npm run build`.
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { describe, expect, it } from "vitest";

const DIST = join(process.cwd(), "dist");

function htmlFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) return htmlFiles(full);
    return name.endsWith(".html") ? [full] : [];
  });
}

if (!existsSync(DIST)) throw new Error("dist/ not found. Run `npm run build` first.");
const pages = htmlFiles(DIST).map((file) => ({
  file,
  route: "/" + relative(DIST, file).replace(/index\.html$/, "").replace(/\\/g, "/"),
  html: readFileSync(file, "utf8"),
}));

function resolves(href: string): boolean {
  const path = href.split(/[?#]/)[0]!;
  if (path === "" || path === "/") return existsSync(join(DIST, "index.html"));
  const target = join(DIST, path);
  return existsSync(target) || existsSync(join(target, "index.html"));
}

describe("built site", () => {
  it("contains the required pages", () => {
    const routes = pages.map((p) => p.route);
    for (const r of ["/", "/projects/", "/projects/lego-sorting-system/", "/impressum/", "/datenschutz/", "/contact/", "/404.html"]) {
      expect(routes).toContain(r);
    }
  });

  describe.each(pages.map((p) => [p.route, p] as const))("%s", (_route, page) => {
    it("has lang, title and meta description", () => {
      expect(page.html).toMatch(/<html lang="en"/);
      expect(page.html).toMatch(/<title>[^<]{5,}<\/title>/);
      expect(page.html).toMatch(/<meta name="description" content="[^"]{30,}"/);
    });

    it("links to the Impressum and privacy policy (German law)", () => {
      expect(page.html).toContain('href="/impressum/"');
      expect(page.html).toContain('href="/datenschutz/"');
    });

    it("has exactly one h1", () => {
      expect(page.html.match(/<h1[\s>]/g)).toHaveLength(1);
    });

    it("has no broken internal links", () => {
      const hrefs = [...page.html.matchAll(/href="(\/[^"]*)"/g)].map((m) => m[1]!);
      const broken = hrefs.filter((h) => !resolves(h));
      expect(broken).toEqual([]);
    });

    it("has no inline scripts (they would be blocked by the CSP)", () => {
      const inline = [...page.html.matchAll(/<script(?![^>]*\ssrc=)[^>]*>/g)];
      expect(inline).toEqual([]);
    });

    it("loads no third-party resources (GDPR: fonts and scripts are self-hosted)", () => {
      const external = [...page.html.matchAll(/<(?:script|link|img|iframe)[^>]+(?:src|href)="(https?:\/\/[^"]+)"/g)]
        .map((m) => m[1]!)
        .filter((url) => !url.startsWith("https://kaarsmarttechs.com"));
      expect(external).toEqual([]);
    });
  });
});
