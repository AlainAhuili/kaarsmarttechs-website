import { describe, expect, it } from "vitest";
import {
  categorySlug,
  filterByCategory,
  sortProjects,
  type ProjectLike,
} from "../../src/lib/projects";

const make = (id: string, order: number, flagship = false, categories: any[] = ["Code Quality"]) =>
  ({ id, data: { order, flagship, categories } }) as ProjectLike;

describe("sortProjects", () => {
  it("puts the flagship first regardless of order", () => {
    const sorted = sortProjects([make("a", 1), make("flag", 9, true), make("b", 2)]);
    expect(sorted.map((p) => p.id)).toEqual(["flag", "a", "b"]);
  });

  it("is stable by id when order is equal and does not mutate input", () => {
    const input = [make("z", 1), make("a", 1)];
    expect(sortProjects(input).map((p) => p.id)).toEqual(["a", "z"]);
    expect(input.map((p) => p.id)).toEqual(["z", "a"]);
  });
});

describe("filterByCategory", () => {
  const list = [make("v", 1, false, ["Computer Vision"]), make("c", 2, false, ["Cloud & DevOps"])];

  it("returns everything for null", () => {
    expect(filterByCategory(list, null)).toHaveLength(2);
  });

  it("returns only matching projects", () => {
    expect(filterByCategory(list, "Cloud & DevOps").map((p) => p.id)).toEqual(["c"]);
  });
});

describe("categorySlug", () => {
  it.each([
    ["Cloud & DevOps", "cloud-devops"],
    ["AI & Agentic Tooling", "ai-agentic-tooling"],
    ["Computer Vision", "computer-vision"],
  ])("%s -> %s", (input, expected) => {
    expect(categorySlug(input)).toBe(expected);
  });
});
