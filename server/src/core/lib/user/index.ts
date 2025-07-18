import express from 'express'

import userAuthRouter from './controllers/auth.controller'
import userOAuthRouter from './controllers/oauth.controller'
import userPersonalizationRouter from './controllers/personalization.controller'
import userSettingsRouter from './controllers/settings.controller'
import userTwoFARouter from './controllers/twoFA.controller'

const router = express.Router()

export const currentSession = {
  token: '',
  tokenId: '',
  tokenExpireAt: '',
  otpId: ''
}

if (!process.env.MASTER_KEY) {
  throw new Error('MASTER_KEY not found in environment variables')
}

router.use('/auth', userAuthRouter)
router.use('/oauth', userOAuthRouter)
router.use('/2fa', userTwoFARouter)
router.use('/settings', userSettingsRouter)
router.use('/personalization', userPersonalizationRouter)

export default router
