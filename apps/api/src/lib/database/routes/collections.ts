import z from 'zod'

import {
  connectToPocketBase,
  validateEnvironmentVariables
} from '@lifeforge/pocketbase'
import { createForge, forgeRouter } from '@lifeforge/server-utils'

const forge = createForge({}, 'database')

const list = forge
  .query({
    description: 'Retrieve all database collections',
    input: {},
    output: {
      OK: z.array(
        z.object({
          name: z.string(),
          type: z.enum(['base', 'view']),
          fields: z.array(
            z.object({
              name: z.string(),
              type: z.string(),
              optional: z.boolean(),
              options: z.array(z.string()).optional()
            })
          )
        })
      )
    }
  })
  .callback(async ({ response }) => {
    const pb = await connectToPocketBase(validateEnvironmentVariables())

    const collections = await pb.collections.getFullList()

    return response.ok(
      collections
        .filter(e => ['base', 'view'].includes(e.type) && !e.system)
        .map(collection => ({
          name: collection.name,
          type: collection.type as 'base' | 'view',
          fields: collection.fields
            .filter(e => !e.system && !e.hidden)
            .map(field => ({
              name: field.name,
              type: field.type,
              optional: !field.required,
              options: field.values || undefined
            }))
        }))
    )
  })

export default forgeRouter({ list })
