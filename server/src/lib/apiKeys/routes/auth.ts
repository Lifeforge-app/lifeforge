import bcrypt from 'bcryptjs'
import z from 'zod'

import { decrypt2 } from '@functions/auth/encryption'
import { default as _validateOTP } from '@functions/auth/validateOTP'
import { forgeController, forgeRouter } from '@functions/routes'

import { challenge } from '..'

const getChallenge = forgeController
  .query()
  .description({
    en: 'Retrieve the authentication challenge for secure login.',
    ms: 'Dapatkan cabaran pengesahan untuk log masuk selamat.',
    'zh-CN': '获取安全登录的身份验证挑战。',
    'zh-TW': '獲取安全登錄的身份驗證挑戰。'
  })
  .input({})
  .callback(async () => challenge)

const createOrUpdate = forgeController
  .mutation()
  .description({
    en: 'Create or update the master password for API keys.',
    ms: 'Cipta atau kemas kini kata laluan induk untuk kunci API.',
    'zh-CN': '创建或更新API密钥的主密码。',
    'zh-TW': '創建或更新API密鑰的主密碼。'
  })
  .input({
    body: z.object({
      password: z.string()
    })
  })
  .callback(async ({ pb, body: { password } }) => {
    const salt = await bcrypt.genSalt(10)

    const decryptedMaster = decrypt2(password, challenge)

    const APIKeysMasterPasswordHash = await bcrypt.hash(decryptedMaster, salt)

    const id = pb.instance.authStore.record!.id

    await pb.update
      .collection('user__users')
      .id(id)
      .data({
        APIKeysMasterPasswordHash
      })
      .execute()
  })

const verify = forgeController
  .mutation()
  .description({
    en: 'Verify the master password for API keys.',
    ms: 'Sahkan kata laluan induk untuk kunci API.',
    'zh-CN': '验证API密钥的主密码。',
    'zh-TW': '驗證API密鑰的主密碼。'
  })
  .input({
    body: z.object({
      password: z.string()
    })
  })
  .callback(async ({ pb, body: { password } }) => {
    const id = pb.instance.authStore.record!.id

    const decryptedMaster = decrypt2(password, challenge)

    const user = await pb.getOne.collection('user__users').id(id).execute()

    const { APIKeysMasterPasswordHash } = user

    return await bcrypt.compare(decryptedMaster, APIKeysMasterPasswordHash)
  })

const verifyOTP = forgeController
  .mutation()
  .description({
    en: 'Verify OTP for API key authentication',
    ms: 'Sahkan OTP untuk pengesahan kunci API',
    'zh-CN': '验证API密钥认证的OTP',
    'zh-TW': '驗證API密鑰認證的OTP'
  })
  .input({
    body: z.object({
      otp: z.string(),
      otpId: z.string()
    })
  })
  .callback(async ({ pb, body }) => await _validateOTP(pb, body, challenge))

export default forgeRouter({
  getChallenge,
  createOrUpdate,
  verify,
  verifyOTP
})
