import { z } from "zod/v4";

const achievementsSchemas = {
  entries: z.object({
    title: z.string(),
    thoughts: z.string(),
    difficulty: z.enum(["easy", "medium", "hard", "impossible"]),
    created: z.string(),
    updated: z.string(),
  }),
};

export default achievementsSchemas;
