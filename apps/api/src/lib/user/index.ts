import {
  connectToPocketBase,
  validateEnvironmentVariables
} from '@functions/database/dbUtils'
import z from 'zod'

import { forgeRouter } from '@lifeforge/server-utils'

import forge from './forge'
import * as authRoutes from './routes/auth'
import * as customFontsRoutes from './routes/customFonts'
import * as personalizationRoutes from './routes/personalization'
import * as qrLoginRoutes from './routes/qrLogin'
import * as settingsRoutes from './routes/settings'

export const currentSession = {
  token: '',
  tokenId: '',
  tokenExpireAt: '',
  otpId: ''
}

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
    .callback(async ({ response }) => {
      const config = validateEnvironmentVariables()

      const superPBInstance = await connectToPocketBase(config)

      const users = await superPBInstance.collection('users').getFullList()

      return response.ok(users.length > 0)
    }),
  auth: authRoutes,
  qrLogin: qrLoginRoutes,
  settings: settingsRoutes,
  personalization: personalizationRoutes,
  customFonts: customFontsRoutes
})
