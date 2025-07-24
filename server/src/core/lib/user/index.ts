import { forgeRouter } from '@functions/routes'

import authRouter from './routes/auth'
import oAuthRouter from './routes/oauth'
import personalizationRouter from './routes/personalization'
import settingsRouter from './routes/settings'
import twoFARouter from './routes/twoFA'

export const currentSession = {
  token: '',
  tokenId: '',
  tokenExpireAt: '',
  otpId: ''
}

if (!process.env.MASTER_KEY) {
  throw new Error('MASTER_KEY not found in environment variables')
}

export default forgeRouter({
  auth: authRouter,
  oauth: oAuthRouter,
  '2fa': twoFARouter,
  settings: settingsRouter,
  personalization: personalizationRouter
})
