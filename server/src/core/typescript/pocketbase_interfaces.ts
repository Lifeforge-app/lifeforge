import { z } from "zod/v4";

const BasePBSchema = z.object({
  id: z.string(),
  collectionId: z.string(),
  collectionName: z.string(),
  created: z.string(),
  updated: z.string(),
});

type WithPB<T> = T & z.infer<typeof BasePBSchema>;

const WithPBSchema = <T extends z.ZodTypeAny>(schema: T) => {
  return z.intersection(schema, BasePBSchema);
};

const PBListResultSchema = <T extends z.ZodTypeAny>(schema: T) => {
  return z.object({
    page: z.number(),
    perPage: z.number(),
    totalItems: z.number(),
    totalPages: z.number(),
    items: z.array(schema),
  });
};

export type { WithPB };
export { WithPBSchema, PBListResultSchema };
