import en from "./en";
import de from "./de";
import fr from "./fr";

/** English lives at the root (/projects/), the others under a prefix (/de/projects/). */
export const LANGS = ["en", "de", "fr"] as const;
export const DEFAULT_LANG = "en";
export type Lang = (typeof LANGS)[number];
export type Dict = typeof en;

const dicts: Record<Lang, Dict> = { en, de, fr };

export function useDict(lang: Lang): Dict {
  return dicts[lang];
}

/** Languages that get a URL prefix, for getStaticPaths of the [lang] routes. */
export const PREFIXED_LANGS = LANGS.filter((l) => l !== DEFAULT_LANG);

export function isLang(value: string | undefined): value is Lang {
  return (LANGS as readonly string[]).includes(value ?? "");
}

/** "/projects/" in German -> "/de/projects/"; English stays "/projects/". */
export function localePath(lang: Lang, path: string): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  return lang === DEFAULT_LANG ? clean : `/${lang}${clean}`;
}

/** "/de/projects/x/" -> { lang: "de", path: "/projects/x/" }. */
export function splitPath(pathname: string): { lang: Lang; path: string } {
  const match = pathname.match(/^\/([a-z]{2})(\/.*|$)/);
  if (match && match[1] !== DEFAULT_LANG && isLang(match[1])) {
    return { lang: match[1], path: match[2] || "/" };
  }
  return { lang: DEFAULT_LANG, path: pathname || "/" };
}

/** Project entries are stored as "<lang>/<slug>". */
export function projectSlug(id: string): string {
  return id.slice(id.indexOf("/") + 1);
}

/** Replaces {name} placeholders, e.g. fill("{n} projects", { n: 3 }). */
export function fill(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => String(values[key] ?? `{${key}}`));
}
