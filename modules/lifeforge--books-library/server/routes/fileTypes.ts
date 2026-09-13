import z from 'zod'

import forge from '../forge'
import schema from '../schema'

export const list = forge
  .query({
    description: 'Get all book file types',
    output: {
      OK: z.array(schema.file_types_aggregated)
    }
  })
  .callback(async ({ pb, response }) =>
    response.ok(
      await pb.getFullList
        .collection('file_types_aggregated')
        .sort(['name'])
        .execute()
    )
  )
