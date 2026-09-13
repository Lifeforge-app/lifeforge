import z from 'zod'

import forge from '../forge'
import schema from '../schema'

export const list = forge
  .query({
    description: 'Get all book read statuses',
    output: {
      OK: z.array(schema.read_status_aggregated)
    }
  })
  .callback(async ({ pb, response }) =>
    response.ok(
      await pb.getFullList.collection('read_status_aggregated').execute()
    )
  )
