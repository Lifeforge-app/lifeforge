import { verify as argonVerify, hash } from 'argon2'
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
      NO_CONTENT: true
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

    return response.noContent()
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
      NO_CONTENT: true
    }
  })
  .callback(async ({ body: { data }, pb, response }) => {
    const { id } = pb.instance.authStore.record!

    if (data.email) {
      await pb.instance.collection('users').requestEmailChange(data.email)

      return response.noContent()
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

    return response.noContent()
  })

export const updatePassword = forge
  .mutation({
    description: 'Update user password directly',
    input: {
      body: z
        .object({
          oldPassword: z.string().min(1),
          password: z.string().min(8),
          passwordConfirm: z.string().min(8)
        })
        .refine(data => data.password === data.passwordConfirm, {
          message: "Passwords don't match",
          path: ['passwordConfirm']
        })
    },
    output: {
      NO_CONTENT: true,
      BAD_REQUEST: z.string()
    }
  })
  .callback(async ({ body: { oldPassword, password }, pb, response }) => {
    const user = await pb.getFirstListItem.collection('users').execute()
    const passwordHash = user.auth_password_hash

    if (!passwordHash) {
      return response.badRequest('User has no password set')
    }

    const valid = await argonVerify(passwordHash, oldPassword)

    if (!valid) {
      return response.badRequest('Incorrect old password')
    }

    const newPasswordHash = await hash(password, {
      type: 2 // argon2id
    })

    await pb.update
      .collection('users')
      .id(user.id)
      .data({
        auth_password_hash: newPasswordHash
      })
      .execute()

    return response.noContent()
  })
