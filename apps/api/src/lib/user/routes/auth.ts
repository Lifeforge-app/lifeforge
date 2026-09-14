import { hash } from 'argon2'
import z from 'zod'

import forge from '../forge'
import { users } from '../schema.drizzle'

export const createFirstUser = forge
  .mutation({
    description: 'Create the first user (only works when no users exist)',
    noAuth: true,
    input: {
      body: z.object({
        email: z.string().email(),
        username: z.string().min(3),
        name: z.string().min(1),
        password: z.string().min(8)
      })
    },
    output: {
      CREATED: z.object({
        state: z.literal('success')
      }),
      BAD_REQUEST: z.string()
    }
  })
  .callback(
    async ({ db, body: { email, username, name, password }, response }) => {
      const existingUser = await db.query.users.findFirst()

      if (existingUser) {
        return response.badRequest('Users already exist')
      }

      const passwordHash = await hash(password, {
        type: 2 // argon2id
      })

      await db.insert(users).values({
        email,
        username,
        name,
        verified: true,
        auth_password_hash: passwordHash,
        theme: 'system',
        language: 'en',
        fontScale: 1.0,
        borderRadiusMultiplier: 1.0
      })

      return response.created({
        state: 'success' as const
      })
    }
  )
