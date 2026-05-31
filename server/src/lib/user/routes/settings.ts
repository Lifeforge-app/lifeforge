import dayjs from 'dayjs'
import z from 'zod'

import forge from '../forge'

export const updateAvatar = forge
  .mutation({
    description: 'Upload new user avatar',
    input: {},
    media: {
      file: {
        optional: false
      }
    },
    output: {
      OK: z.string()
    }
  })
  .callback(
    async ({
      media: { file: rawFile },
      pb,
      core: {
        media: { retrieveMedia }
      },
      response
    }) => {
      const fileResult = await retrieveMedia('avatar', rawFile)

      const { id } = pb.instance.authStore.record!

      const newRecord = await pb.update
        .collection('users')
        .id(id)
        .data(fileResult)
        .execute()

      return response.ok(newRecord.avatar)
    }
  )

export const deleteAvatar = forge
  .mutation({
    description: 'Remove user avatar',
    input: {},
    output: {
      OK: z.void()
    }
  })
  .callback(async ({ pb, response }) => {
    const { id } = pb.instance.authStore.record!

    await pb.update
      .collection('users')
      .id(id)
      .data({
        avatar: ''
      })
      .execute()

    return response.ok()
  })

export const updateProfile = forge
  .mutation({
    description: 'Update user profile information',
    input: {
      body: z.object({
        data: z.object({
          username: z
            .string()
            .regex(/^[a-zA-Z0-9]+$/)
            .optional(),
          email: z.string().email().optional(),
          name: z.string().optional(),
          dateOfBirth: z.string().optional()
        })
      })
    },
    output: {
      OK: z.void()
    }
  })
  .callback(async ({ body: { data }, pb, response }) => {
    const { id } = pb.instance.authStore.record!

    if (data.email) {
      await pb.instance.collection('users').requestEmailChange(data.email)

      return response.ok()
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

    return response.ok()
  })

export const requestPasswordReset = forge
  .mutation({
    description: 'Request password reset email',
    input: {},
    output: {
      OK: z.void()
    }
  })
  .callback(async ({ pb, response }) => {
    await pb.instance
      .collection('users')
      .requestPasswordReset(pb.instance.authStore.record?.email)

    return response.ok()
  })