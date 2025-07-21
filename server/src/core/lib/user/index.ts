import forgeRouter from '@functions/forgeRouter'

import authRouter from './controllers/auth'
import oAuthRouter from './controllers/oauth'
import personalizationRouter from './controllers/personalization'
import settingsRouter from './controllers/settings'
import twoFARouter from './controllers/twoFA'

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
  '/auth': authRouter,
  '/oauth': oAuthRouter,
  '/2fa': twoFARouter,
  '/settings': settingsRouter,
  '/personalization': personalizationRouter
})
