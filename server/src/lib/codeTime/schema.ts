import { z } from "zod/v4";

const codeTimeSchemas = {
  projects: z.object({
    name: z.string(),
    duration: z.number(),
  }),
  languages: z.object({
    name: z.string(),
    icon: z.string(),
    color: z.string(),
    duration: z.number(),
  }),
  daily_entries: z.object({
    date: z.string(),
    relative_files: z.any(),
    projects: z.any(),
    total_minutes: z.number(),
    last_timestamp: z.number(),
    languages: z.any(),
    created: z.string(),
    updated: z.string(),
  }),
};

export default codeTimeSchemas;
