import getMedia from '@functions/external/media'
import { forgeController, forgeRouter } from '@functions/routes'
import moment from 'moment'
import { z } from 'zod/v4'

const updateAvatar = forgeController
  .mutation()
  .description('Update user avatar')
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
      .collection('users__users')
      .id(id)
      .data(fileResult)
      .execute()

    return newRecord.avatar
  })

const deleteAvatar = forgeController
  .mutation()
  .description('Delete user avatar')
  .input({})
  .statusCode(204)
  .callback(async ({ pb }) => {
    const { id } = pb.instance.authStore.record!

    await pb.update
      .collection('users__users')
      .id(id)
      .data({
        avatar: ''
      })
      .execute()
  })

const updateProfile = forgeController
  .mutation()
  .description('Update user profile')
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
      updateData.dateOfBirth = `${moment(data.dateOfBirth).add(1, 'day').format('YYYY-MM-DD')}T00:00:00.000Z`
    }

    if (Object.keys(updateData).length > 0) {
      await pb.update
        .collection('users__users')
        .id(id)
        .data(updateData)
        .execute()
    }
  })

const requestPasswordReset = forgeController
  .mutation()
  .description('Request password reset')
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
