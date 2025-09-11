import { forgeController, forgeRouter } from '@functions/routes'
import { ClientError } from '@functions/routes/utils/response'
import { z } from 'zod/v4'

const toggle = forgeController
  .mutation()
  .description('Toggle a module on/off')
  .input({
    query: z.object({
      id: z.string()
    })
  })
  .callback(async ({ pb, query: { id } }) => {
    const user = pb.instance.authStore.record

    if (!user) {
      throw new ClientError('Unauthorized to toggle module')
    }

    const modules = user.enabledModules || []

    if (!modules.includes(id)) {
      modules.push(id)
    } else {
      const index = modules.indexOf(id)

      if (index > -1) {
        modules.splice(index, 1)
      }
    }

    await pb.update
      .collection('users__users')
      .id(user.id)
      .data({
        enabledModules: modules
      })
      .execute()
  })

export default forgeRouter({
  toggle
})
