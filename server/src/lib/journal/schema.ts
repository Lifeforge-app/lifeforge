import { z } from "zod/v4";

const journalSchemas = {
  entries: z.object({
    raw: z.string(),
    summary: z.string(),
    content: z.string(),
    mood: z.any(),
    photos: z.array(z.string()),
    date: z.string(),
    title: z.string(),
    created: z.string(),
    updated: z.string(),
  }),
};

export default journalSchemas;
