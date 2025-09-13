import { z } from "zod/v4";

const apiKeysSchemas = {
  entries: z.object({
    keyId: z.string(),
    name: z.string(),
    description: z.string(),
    icon: z.string(),
    key: z.string(),
    created: z.string(),
    updated: z.string(),
  }),
};

export default apiKeysSchemas;
