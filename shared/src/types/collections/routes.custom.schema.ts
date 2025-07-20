import { z } from 'zod/v4'

const Route = z.object({
  method: z.string(),
  path: z.string(),
  description: z.string(),
  schema: z.object({
    response: z.any(),
    params: z.any().optional(),
    body: z.any().optional(),
    query: z.any().optional()
  })
})

type IRoute = z.infer<typeof Route>

export type { IRoute }

export { Route }
