import moment from 'moment'
import z from 'zod'

import getMedia from '@functions/external/media'
import { forgeController, forgeRouter } from '@functions/routes'

const updateAvatar = forgeController
  .mutation()
  .description({
    en: 'Upload new user avatar',
    ms: 'Muat naik avatar pengguna baharu',
    'zh-CN': '上传新的用户头像',
    'zh-TW': '上傳新的用戶頭像'
  })
  .input({})
  .media({
    file: {
      optional: false
    }
  })
  .callback(async ({ media: { file: rawFile }, pb }) => {
    const fileResult = await getMedia('avatar', rawFile)

    const { id } = pb.instance.authStore.record!

    const newRecord = await pb.update
      .collection('user__users')
      .id(id)
      .data(fileResult)
      .execute()

    return newRecord.avatar
  })

const deleteAvatar = forgeController
  .mutation()
  .description({
    en: 'Remove user avatar',
    ms: 'Alih keluar avatar pengguna',
    'zh-CN': '移除用户头像',
    'zh-TW': '移除用戶頭像'
  })
  .input({})
  .statusCode(204)
  .callback(async ({ pb }) => {
    const { id } = pb.instance.authStore.record!

    await pb.update
      .collection('user__users')
      .id(id)
      .data({
        avatar: ''
      })
      .execute()
  })

const updateProfile = forgeController
  .mutation()
  .description({
    en: 'Update user profile information',
    ms: 'Kemas kini maklumat profil pengguna',
    'zh-CN': '更新用户资料信息',
    'zh-TW': '更新用戶資料信息'
  })
  .input({
    body: z.object({
      data: z.object({
        username: z
          .string()
          .regex(/^[a-zA-Z0-9]+$/)
          .optional(),
        email: z.email().optional(),
        name: z.string().optional(),
        dateOfBirth: z.string().optional()
      })
    })
  })
  .statusCode(200)
  .callback(async ({ body: { data }, pb }) => {
    const { id } = pb.instance.authStore.record!

    if (data.email) {
      await pb.instance.collection('users').requestEmailChange(data.email)

      return
    }

    const updateData: {
      username?: string
      name?: string
      dateOfBirth?: string
    } = {}

    if (data.username) updateData.username = data.username
    if (data.name) updateData.name = data.name

    if (data.dateOfBirth) {
      updateData.dateOfBirth = moment(data.dateOfBirth).format('YYYY-MM-DD')
    }

    if (Object.keys(updateData).length > 0) {
      await pb.update
        .collection('user__users')
        .id(id)
        .data(updateData)
        .execute()
    }
  })

const requestPasswordReset = forgeController
  .mutation()
  .description({
    en: 'Request password reset email',
    ms: 'Minta e-mel tetapan semula kata laluan',
    'zh-CN': '请求密码重置邮件',
    'zh-TW': '請求密碼重置郵件'
  })
  .input({})
  .callback(({ pb }) =>
    pb.instance
      .collection('users')
      .requestPasswordReset(pb.instance.authStore.record?.email)
  )

export default forgeRouter({
  updateAvatar,
  deleteAvatar,
  updateProfile,
  requestPasswordReset
})
