import z from 'zod'

import forge from '../forge'
import blogSchemas from '../schema'

export const list = forge
  .query({
    description: 'Get all blog entries',
    output: {
      OK: z.array(blogSchemas.entries.schema)
    }
  })
  .callback(async ({ pb, response }) =>
    response.ok(await pb.getFullList.collection('blog__entries').execute())
  )
