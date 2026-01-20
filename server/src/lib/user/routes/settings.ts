import dayjs from 'dayjs'
import z from 'zod'

import forge from '../forge'

export const updateAvatar = forge
  .mutation()
  .description('Upload new user avatar')
  .input({})
  .media({
    file: {
      optional: false
    }
  })
  .callback(
    async ({
      media: { file: rawFile },
      pb,
      core: {
        media: { retrieveMedia }
      }
    }) => {
      const fileResult = await retrieveMedia('avatar', rawFile)

      const { id } = pb.instance.authStore.record!

      const newRecord = await pb.update
        .collection('users')
        .id(id)
        .data(fileResult)
        .execute()

      return newRecord.avatar
    }
  )

export const deleteAvatar = forge
  .mutation()
  .description('Remove user avatar')
  .input({})
  .statusCode(204)
  .callback(async ({ pb }) => {
    const { id } = pb.instance.authStore.record!

    await pb.update
      .collection('users')
      .id(id)
      .data({
        avatar: ''
      })
      .execute()
  })

export const updateProfile = forge
  .mutation()
  .description('Update user profile information')
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
      updateData.dateOfBirth = dayjs(data.dateOfBirth).format('YYYY-MM-DD')
    }

    if (Object.keys(updateData).length > 0) {
      await pb.update.collection('users').id(id).data(updateData).execute()
    }
  })

export const requestPasswordReset = forge
  .mutation()
  .description('Request password reset email')
  .input({})
  .callback(({ pb }) =>
    pb.instance
      .collection('users')
      .requestPasswordReset(pb.instance.authStore.record?.email)
  )
