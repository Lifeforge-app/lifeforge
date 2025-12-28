import bcrypt from 'bcryptjs'
import z from 'zod'

import { decrypt2 } from '@functions/auth/encryption'
import { forgeController, forgeRouter } from '@functions/routes'
import { ClientError } from '@functions/routes/utils/response'

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
  .callback(async ({ pb, body: { password }, req }) => {
    const userId = req.jwtPayload?.userId

    if (!userId) {
      throw new ClientError('User not authenticated', 401)
    }

    const salt = await bcrypt.genSalt(10)

    const decryptedMaster = decrypt2(password, challenge)

    const APIKeysMasterPasswordHash = await bcrypt.hash(decryptedMaster, salt)

    await pb.update
      .collection('user__users')
      .id(userId)
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
  .callback(async ({ pb, body: { password }, req }) => {
    const userId = req.jwtPayload?.userId

    if (!userId) {
      throw new ClientError('User not authenticated', 401)
    }

    const decryptedMaster = decrypt2(password, challenge)

    const user = await pb.getOne.collection('user__users').id(userId).execute()

    const { APIKeysMasterPasswordHash } = user

    return await bcrypt.compare(decryptedMaster, APIKeysMasterPasswordHash)
  })

export default forgeRouter({
  getChallenge,
  createOrUpdate,
  verify
})
