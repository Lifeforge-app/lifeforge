import { default as _validateOTP } from '@functions/auth/validateOTP'
import { forgeController, forgeRouter } from '@functions/routes'
import { ClientError } from '@functions/routes/utils/response'
import moment from 'moment'
import PocketBase from 'pocketbase'
import { v4 } from 'uuid'
import z from 'zod'

import { currentSession } from '..'
import { removeSensitiveData, updateNullData } from '../utils/auth'

const validateOTP = forgeController
  .mutation()
  .noEncryption()
  .description({
    en: 'Verify one-time password',
    ms: 'Sahkan kata laluan sekali guna',
    'zh-CN': '验证一次性密码',
    'zh-TW': '驗證一次性密碼'
  })
  .input({
    body: z.object({
      otp: z.string(),
      otpId: z.string()
    })
  })
  .callback(({ pb, body }) => _validateOTP(pb, body))

const generateOTP = forgeController
  .query()
  .noEncryption()
  .description({
    en: 'Generate one-time password',
    ms: 'Jana kata laluan sekali guna',
    'zh-CN': '生成一次性密码',
    'zh-TW': '生成一次性密碼'
  })
  .input({})
  .callback(
    async ({ pb }) =>
      (
        await pb.instance
          .collection('users')
          .requestOTP(pb.instance.authStore.record?.email)
      ).otpId
  )

const login = forgeController
  .mutation()
  .noAuth()
  .description({
    en: 'Authenticate user with credentials',
    ms: 'Sahkan pengguna dengan kelayakan',
    'zh-CN': '使用凭据认证用户',
    'zh-TW': '使用憑證認證用戶'
  })
  .input({
    body: z.object({
      email: z.string(),
      password: z.string()
    })
  })
  .callback(async ({ body: { email, password } }) => {
    const pb = new PocketBase(process.env.PB_HOST)

    let failed = false

    await pb
      .collection('users')
      .authWithPassword(email, password)
      .catch(() => {
        failed = true
      })

    if (pb.authStore.isValid && !failed) {
      const userData = pb.authStore.record

      if (!userData) {
        throw new ClientError('Invalid credentials', 401)
      }

      const sanitizedUserData = removeSensitiveData(userData)

      if (sanitizedUserData.twoFAEnabled) {
        currentSession.token = pb.authStore.token
        currentSession.tokenExpireAt = moment().add(5, 'minutes').toISOString()
        currentSession.tokenId = v4()

        return {
          state: '2fa_required' as const,
          tid: currentSession.tokenId
        }
      }

      await updateNullData(sanitizedUserData, pb)

      return {
        state: 'success' as const,
        session: pb.authStore.token
      }
    } else {
      throw new ClientError('Invalid credentials', 401)
    }
  })

const verifySessionToken = forgeController
  .mutation()
  .noEncryption()
  .description({
    en: 'Validate user session token',
    ms: 'Sahkan token sesi pengguna',
    'zh-CN': '验证用户会话令牌',
    'zh-TW': '驗證用戶會話令牌'
  })
  .input({})
  .callback(async ({ req }) => {
    const bearerToken = req.headers.authorization?.split(' ')[1].trim()

    const pb = new PocketBase(process.env.PB_HOST)

    if (!bearerToken) {
      throw new ClientError('No token provided', 401)
    }

    pb.authStore.save(bearerToken, null)
    await pb
      .collection('users')
      .authRefresh()
      .catch(() => {})

    if (!pb.authStore.isValid) {
      throw new ClientError('Invalid session', 401)
    }

    if (!pb.authStore.record) {
      throw new ClientError('Invalid session', 401)
    }

    return {
      valid: true as const,
      session: pb.authStore.token
    }
  })

const getUserData = forgeController
  .query()
  .description({
    en: 'Get current user data',
    ms: 'Dapatkan data pengguna semasa',
    'zh-CN': '获取当前用户数据',
    'zh-TW': '獲取當前用戶資料'
  })
  .input({})
  .callback(async ({ pb }) => {
    const userData = pb.instance.authStore.record

    if (!userData) {
      throw new ClientError('User not found', 404)
    }

    const sanitizedUserData = removeSensitiveData(userData)

    await updateNullData(sanitizedUserData, pb.instance)

    return sanitizedUserData
  })

export default forgeRouter({
  validateOTP,
  generateOTP,
  login,
  verifySessionToken,
  getUserData
})
