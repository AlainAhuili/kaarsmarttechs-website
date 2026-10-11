export const STATUSES = ["In development", "Internal", "Client work"] as const;
export const CATEGORIES = [
  "Computer Vision",
  "Embedded Systems",
  "Cloud & DevOps",
  "AI & Agentic Tooling",
  "Code Quality",
] as const;

export type Status = (typeof STATUSES)[number];
export type Category = (typeof CATEGORIES)[number];

export interface ProjectLike {
  id: string;
  data: { order: number; flagship: boolean; categories: readonly Category[] };
}

/** Flagship first, then by explicit order, then by id for a stable result. */
export function sortProjects<T extends ProjectLike>(projects: readonly T[]): T[] {
  return [...projects].sort(
    (a, b) =>
      Number(b.data.flagship) - Number(a.data.flagship) ||
      a.data.order - b.data.order ||
      a.id.localeCompare(b.id),
  );
}

export function filterByCategory<T extends ProjectLike>(
  projects: readonly T[],
  category: Category | null,
): T[] {
  return category ? projects.filter((p) => p.data.categories.includes(category)) : [...projects];
}

/** URL-safe tag used by the client-side filter, e.g. "Cloud & DevOps" -> "cloud-devops". */
export function categorySlug(category: string): string {
  return category
    .toLowerCase()
    .replace(/&/g, " ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
