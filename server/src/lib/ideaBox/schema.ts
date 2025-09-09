import { z } from "zod/v4";

const ideaBoxSchemas = {
  containers: z.object({
    icon: z.string(),
    color: z.string(),
    name: z.string(),
    cover: z.string(),
  }),
  entries: z.object({
    type: z.enum(["text", "image", "link"]),
    container: z.string(),
    folder: z.string(),
    pinned: z.boolean(),
    archived: z.boolean(),
    tags: z.any(),
    created: z.string(),
    updated: z.string(),
  }),
  folders: z.object({
    container: z.string(),
    name: z.string(),
    color: z.string(),
    icon: z.string(),
    parent: z.string(),
  }),
  tags: z.object({
    name: z.string(),
    icon: z.string(),
    color: z.string(),
    container: z.string(),
  }),
  tags_aggregated: z.object({
    name: z.string(),
    color: z.string(),
    icon: z.string(),
    container: z.string(),
    amount: z.number(),
  }),
  containers_aggregated: z.object({
    name: z.string(),
    color: z.string(),
    icon: z.string(),
    cover: z.string(),
    text_count: z.number(),
    link_count: z.number(),
    image_count: z.number(),
  }),
  entries_text: z.object({
    base_entry: z.string(),
    content: z.string(),
  }),
  entries_link: z.object({
    link: z.url(),
    base_entry: z.string(),
  }),
  entries_image: z.object({
    image: z.string(),
    base_entry: z.string(),
  }),
};

export default ideaBoxSchemas;
