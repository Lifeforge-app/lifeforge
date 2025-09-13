import { z } from "zod/v4";

const blogSchemas = {
  entries: z.object({
    content: z.string(),
    title: z.string(),
    media: z.array(z.string()),
    excerpt: z.string(),
    visibility: z.enum(["private", "public", "unlisted", ""]),
    featured_image: z.string(),
    labels: z.any(),
    category: z.string(),
    created: z.string(),
    updated: z.string(),
  }),
  categories: z.object({
    name: z.string(),
    color: z.string(),
    icon: z.string(),
  }),
};

export default blogSchemas;
