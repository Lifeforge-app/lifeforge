import { forgeRouter } from '@lifeforge/server-utils'

import {
  connectToPocketBase,
  validateEnvironmentVariables
} from '@functions/database/dbUtils'

import forge from './forge'
import * as authRoutes from './routes/auth'
import * as customFontsRoutes from './routes/customFonts'
import * as oAuthRoutes from './routes/oauth'
import * as personalizationRoutes from './routes/personalization'
import * as qrLoginRoutes from './routes/qrLogin'
import * as settingsRoutes from './routes/settings'
import * as twoFARoutes from './routes/twoFA'

export const currentSession = {
  token: '',
  tokenId: '',
  tokenExpireAt: '',
  otpId: ''
}

// Per-user 2FA state management (replaces global mutable state)
interface TwoFAState {
  canDisable?: boolean
  expiresAt?: string
  tempCode?: string
  tempCodeExpiresAt?: string
  challenge?: string
  challengeExpiresAt?: string
}

export const twoFAStates = new Map<string, TwoFAState>()

// OAuth state management (replaces global codeVerifier)
interface OAuthState {
  codeVerifier: string
  provider: string
  expiresAt: string
}

export const oauthStates = new Map<string, OAuthState>()

export default forgeRouter({
  exists: forge
    .query()
    .noAuth()
    .description('Check if user exists')
    .input({})
    .callback(async () => {
      const config = validateEnvironmentVariables()

      const superPBInstance = await connectToPocketBase(config)

      const users = await superPBInstance.collection('users').getFullList()

      return users.length > 0
    }),
  auth: authRoutes,
  oauth: oAuthRoutes,
  '2fa': twoFARoutes,
  qrLogin: qrLoginRoutes,
  settings: settingsRoutes,
  personalization: personalizationRoutes,
  customFonts: customFontsRoutes
})
