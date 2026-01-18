import { createForge, forgeRouter } from '@lifeforge/server-utils'

import {
  connectToPocketBase,
  validateEnvironmentVariables
} from '@functions/database/dbUtils'

const forge = createForge({}, 'database')

const list = forge
  .query()
  .description('Retrieve all database collections')
  .input({})
  .callback(async () => {
    const pb = await connectToPocketBase(validateEnvironmentVariables())

    const collections = await pb.collections.getFullList()

    return collections
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
  })

export default forgeRouter({ list })
