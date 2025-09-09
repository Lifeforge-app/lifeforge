import { getPBSuperUserInstance } from '@functions/database'
import { forgeController, forgeRouter } from '@functions/routes'

const list = forgeController.query
  .description('List all collections')
  .input({})
  .callback(async () => {
    const pb = await getPBSuperUserInstance()

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
