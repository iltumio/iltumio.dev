import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const blog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/blog" }),
  // Type-check frontmatter using a schema
  schema: z.object({
    title: z.string(),
    description: z.string(),
    image: z.string().optional(),
    // Transform string to Date object
    date: z
      .string()
      .or(z.date())
      .transform((val) => new Date(val)),
    draft: z.boolean().default(false),
    noindex: z.boolean().default(false),
  }),
});

export const collections = { blog };
