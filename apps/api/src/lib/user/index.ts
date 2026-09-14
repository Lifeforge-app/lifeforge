import z from 'zod'
import { forgeRouter } from '@lifeforge/server-utils'

import forge from './forge'
import * as authRoutes from './routes/auth'
import * as customFontsRoutes from './routes/customFonts'
import * as personalizationRoutes from './routes/personalization'
import * as settingsRoutes from './routes/settings'

export default forgeRouter({
  exists: forge
    .query({
      description: 'Check if user exists',
      noAuth: true,
      input: {},
      output: {
        OK: z.boolean()
      }
    })
    .callback(async ({ db, response }) => {
      const user = await db.query.users.findFirst()

      return response.ok(Boolean(user))
    }),
  auth: authRoutes,
  settings: settingsRoutes,
  personalization: personalizationRoutes,
  customFonts: customFontsRoutes
})
