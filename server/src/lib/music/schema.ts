import { z } from "zod/v4";

const musicSchemas = {
  entries: z.object({
    name: z.string(),
    duration: z.string(),
    author: z.string(),
    file: z.string(),
    is_favourite: z.boolean(),
  }),
};

export default musicSchemas;
