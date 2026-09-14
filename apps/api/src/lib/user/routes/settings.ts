import { verify as argonVerify, hash } from 'argon2'
import dayjs from 'dayjs'
import { eq } from 'drizzle-orm'
import z from 'zod'

import forge from '../forge'
import { users } from '../schema.drizzle'

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
      OK: z.string(),
      BAD_REQUEST: z.string(),
      UNAUTHORIZED: true
    }
  })
  .callback(
    async ({
      media: { file: rawFile },
      db,
      core,
      response
    }) => {
      if (!rawFile || typeof rawFile === 'string') {
        return response.badRequest('A valid avatar image must be uploaded')
      }

      const user = await db.query.users.findFirst()

      if (!user) {
        return response.unauthorized()
      }

      const avatarKey = await core.storage.save({
        file: rawFile,
        currentKey: user.avatar || undefined,
        table: 'users',
        field: 'avatar',
        thumbs: ['256x0']
      })

      if (!avatarKey) {
        return response.badRequest('Failed to save avatar')
      }

      await db
        .update(users)
        .set({ avatar: avatarKey, updated: new Date() })
        .where(eq(users.id, user.id))

      return response.ok(avatarKey)
    }
  )

export const deleteAvatar = forge
  .mutation({
    description: 'Remove user avatar',
    input: {},
    output: {
      NO_CONTENT: true,
      UNAUTHORIZED: true
    }
  })
  .callback(async ({ db, core, response }) => {
    const user = await db.query.users.findFirst()

    if (!user) {
      return response.unauthorized()
    }

    if (user.avatar) {
      await core.storage.delete(user.avatar)
    }

    await db
      .update(users)
      .set({
        avatar: null,
        updated: new Date()
      })
      .where(eq(users.id, user.id))

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
      NO_CONTENT: true,
      UNAUTHORIZED: true
    }
  })
  .callback(async ({ body: { data }, db, response }) => {
    const user = await db.query.users.findFirst()

    if (!user) {
      return response.unauthorized()
    }

    const updateData: {
      email?: string
      username?: string
      name?: string
      dateOfBirth?: string
      updated?: Date
    } = {}

    if (data.email) updateData.email = data.email
    if (data.username) updateData.username = data.username
    if (data.name) updateData.name = data.name

    if (data.dateOfBirth) {
      updateData.dateOfBirth = dayjs(data.dateOfBirth).format('YYYY-MM-DD')
    }

    if (Object.keys(updateData).length > 0) {
      updateData.updated = new Date()
      await db.update(users).set(updateData).where(eq(users.id, user.id))
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
      BAD_REQUEST: z.string(),
      UNAUTHORIZED: true
    }
  })
  .callback(async ({ body: { oldPassword, password }, db, response }) => {
    const user = await db.query.users.findFirst()

    if (!user) {
      return response.unauthorized()
    }

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

    await db
      .update(users)
      .set({
        auth_password_hash: newPasswordHash,
        updated: new Date()
      })
      .where(eq(users.id, user.id))

    return response.noContent()
  })
