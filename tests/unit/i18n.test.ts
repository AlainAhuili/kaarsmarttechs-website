import { describe, expect, it } from "vitest";
import { fill, localePath, projectSlug, splitPath, useDict, LANGS } from "../../src/i18n";

describe("localePath", () => {
  it("keeps English at the root and prefixes the others", () => {
    expect(localePath("en", "/projects/")).toBe("/projects/");
    expect(localePath("de", "/projects/")).toBe("/de/projects/");
    expect(localePath("fr", "/")).toBe("/fr/");
    expect(localePath("de", "/#about")).toBe("/de/#about");
  });
});

describe("splitPath", () => {
  it.each([
    ["/", "en", "/"],
    ["/projects/x/", "en", "/projects/x/"],
    ["/de/", "de", "/"],
    ["/de", "de", "/"],
    ["/fr/impressum/", "fr", "/impressum/"],
    ["/en/projects/", "en", "/en/projects/"], // English has no prefix
    ["/design/", "en", "/design/"], // not a language prefix
  ])("%s -> %s %s", (input, lang, path) => {
    expect(splitPath(input)).toEqual({ lang, path });
  });

  it("round-trips with localePath", () => {
    for (const lang of LANGS) {
      expect(splitPath(localePath(lang, "/services/"))).toEqual({ lang, path: "/services/" });
    }
  });
});

describe("fill and projectSlug", () => {
  it("replaces placeholders", () => {
    expect(fill("{n} projects", { n: 3 })).toBe("3 projects");
    expect(fill("Status: {status}", {})).toBe("Status: {status}");
  });

  it("drops the language folder from a project id", () => {
    expect(projectSlug("de/lego-sorting-system")).toBe("lego-sorting-system");
  });
});

describe("dictionaries", () => {
  it("translate every status and category", () => {
    for (const lang of LANGS) {
      const t = useDict(lang);
      for (const value of [...Object.values(t.status), ...Object.values(t.categories)]) {
        expect(value.trim()).not.toBe("");
      }
    }
  });
});
