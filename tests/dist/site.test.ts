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

// English at the root, German and French under a prefix.
const PREFIXES = { en: "", de: "/de", fr: "/fr" } as const;
const langOf = (route: string) => (route.match(/^\/(de|fr)\//)?.[1] ?? "en") as keyof typeof PREFIXES;
const unprefixed = (route: string) => route.replace(/^\/(de|fr)(?=\/)/, "");

describe("built site", () => {
  it("contains the required pages in every language", () => {
    const routes = pages.map((p) => p.route);
    expect(routes).toContain("/404.html");
    for (const prefix of Object.values(PREFIXES)) {
      for (const r of ["/", "/projects/", "/projects/lego-sorting-system/", "/impressum/", "/datenschutz/", "/contact/", "/services/"]) {
        expect(routes).toContain(prefix + r);
      }
    }
  });

  it("has every page in all three languages", () => {
    const byLang = (lang: keyof typeof PREFIXES) =>
      pages.filter((p) => p.route !== "/404.html" && langOf(p.route) === lang).map((p) => unprefixed(p.route)).sort();
    expect(byLang("de")).toEqual(byLang("en"));
    expect(byLang("fr")).toEqual(byLang("en"));
  });

  describe.each(pages.map((p) => [p.route, p] as const))("%s", (route, page) => {
    const lang = langOf(route);

    it("has lang, title and meta description", () => {
      expect(page.html).toContain(`<html lang="${lang}"`);
      expect(page.html).toMatch(/<title>[^<]{5,}<\/title>/);
      expect(page.html).toMatch(/<meta name="description" content="[^"]{30,}"/);
    });

    it("links to the Impressum and privacy policy (German law)", () => {
      expect(page.html).toContain(`href="${PREFIXES[lang]}/impressum/"`);
      expect(page.html).toContain(`href="${PREFIXES[lang]}/datenschutz/"`);
    });

    it.skipIf(route === "/404.html")("names its versions in every language, and they exist", () => {
      const alternates = [...page.html.matchAll(/<link rel="alternate" hreflang="([\w-]+)" href="https?:\/\/[^/"]+(\/[^"]*)"/g)];
      expect(alternates.map((m) => m[1]).sort()).toEqual(["de", "en", "fr", "x-default"]);
      expect(alternates.map((m) => m[2]!).filter((h) => !resolves(h))).toEqual([]);
    });

    it("has exactly one h1", () => {
      expect(page.html.match(/<h1[\s>]/g)).toHaveLength(1);
    });

    it("has no broken internal links", () => {
      const hrefs = [...page.html.matchAll(/href="(\/[^"]*)"/g)].map((m) => m[1]!);
      const broken = hrefs.filter((h) => !resolves(h));
      expect(broken).toEqual([]);
    });

    it("has no missing video or poster files", () => {
      const files = [...page.html.matchAll(/(?:<source[^>]+src|poster)="(\/[^"]*)"/g)].map((m) => m[1]!);
      expect(files.filter((f) => !resolves(f))).toEqual([]);
    });

    it("has no inline scripts (they would be blocked by the CSP)", () => {
      const inline = [...page.html.matchAll(/<script(?![^>]*\ssrc=)[^>]*>/g)];
      expect(inline).toEqual([]);
    });

    it("loads no third-party resources (GDPR: fonts and scripts are self-hosted)", () => {
      const external = [...page.html.matchAll(/<(?:script|link|img|iframe|video|source)[^>]+(?:src|href|poster)="(https?:\/\/[^"]+)"/g)]
        .map((m) => m[1]!)
        .filter((url) => !url.startsWith("https://kaarsmarttechs.com"));
      expect(external).toEqual([]);
    });
  });
});
