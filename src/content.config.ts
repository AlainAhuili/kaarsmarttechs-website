import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";
import { CATEGORIES, STATUSES } from "./lib/projects";

// Mirrors the portfolio entry template: every project carries the same fields.
const projects = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/projects" }),
  schema: z.object({
    title: z.string().min(2).max(60),
    tagline: z.string().max(140),
    status: z.enum(STATUSES),
    categories: z.array(z.enum(CATEGORIES)).min(1).max(3),
    flagship: z.boolean().default(false),
    order: z.number().int(),
    problem: z.string(),
    stack: z.array(z.string()).min(1),
    // Only measured numbers are published; empty "value" renders as "Measuring".
    metrics: z.array(z.object({ label: z.string(), value: z.string().optional() })).default([]),
  }),
});

export const collections = { projects };
