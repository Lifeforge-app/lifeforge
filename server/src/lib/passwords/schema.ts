import { z } from "zod/v4";

const passwordsSchemas = {
  entries: z.object({
    name: z.string(),
    website: z.string(),
    username: z.string(),
    password: z.string(),
    icon: z.string(),
    color: z.string(),
    pinned: z.boolean(),
    created: z.string(),
    updated: z.string(),
  }),
};

export default passwordsSchemas;
