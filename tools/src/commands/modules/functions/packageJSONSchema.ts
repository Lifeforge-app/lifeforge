import z from 'zod'

export const packageJSONSchema = z.object({
  name: z.string(),
  displayName: z.string(),
  version: z.string(),
  description: z.string(),
  author: z.string(),
  scripts: z
    .object({
      types: z.string()
    })
    .optional(),
  dependencies: z.record(z.string(), z.string()).optional(),
  devDependencies: z.record(z.string(), z.string()).optional(),
  lifeforge: z.object({
    icon: z.string(),
    category: z.string(),
    APIKeyAccess: z
      .record(
        z.string(),
        z.object({
          usage: z.string(),
          required: z.boolean()
        })
      )
      .optional()
  })
})
