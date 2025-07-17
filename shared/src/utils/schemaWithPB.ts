import { z } from 'zod/v4'

const BasePBSchema = z.object({
  id: z.string(),
  collectionId: z.string(),
  collectionName: z.string(),
  created: z.string(),
  updated: z.string()
})

export const SchemaWithPB = <T extends z.ZodTypeAny>(schema: T) => {
  return z.intersection(schema, BasePBSchema)
}

export type ISchemaWithPB<T> = T & z.infer<typeof BasePBSchema>
