import { forgeRouter } from '@lifeforge/server-sdk'

import {
  connectToPocketBase,
  validateEnvironmentVariables
} from '@functions/database/dbUtils'
import { forgeController } from '@functions/routes'

import authRouter from './routes/auth'
import customFontsRouter from './routes/customFonts'
import oAuthRouter from './routes/oauth'
import personalizationRouter from './routes/personalization'
import qrLoginRouter from './routes/qrLogin'
import settingsRouter from './routes/settings'
import twoFARouter from './routes/twoFA'

export const currentSession = {
  token: '',
  tokenId: '',
  tokenExpireAt: '',
  otpId: ''
}

export default forgeRouter({
  exists: forgeController
    .query()
    .noAuth()
    .description({
      en: 'Check if user exists',
      ms: 'Cek keadaan pengguna',
      'zh-CN': '检查用户是否存在',
      'zh-TW': '檢查用戶是否存在'
    })
    .input({})
    .callback(async () => {
      const config = validateEnvironmentVariables()

      const superPBInstance = await connectToPocketBase(config)

      const users = await superPBInstance.collection('users').getFullList()

      return users.length > 0
    }),
  auth: authRouter,
  oauth: oAuthRouter,
  '2fa': twoFARouter,
  qrLogin: qrLoginRouter,
  settings: settingsRouter,
  personalization: personalizationRouter,
  customFonts: customFontsRouter
})
