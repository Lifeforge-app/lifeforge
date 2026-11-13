import { createSelectSchema } from 'drizzle-orm/zod'
import z from 'zod'

import { fileReferenceSchema } from '@lifeforge/file-storage'

import forge from '../forge'
import { users } from '../schema.drizzle'

const userSelectSchema = createSelectSchema(users)

export const me = forge
  .query({
    description: 'Get current user data',
    encrypted: false,
    input: {},
    output: {
      OK: z.object({
        userData: userSelectSchema
          .omit({
            APIKeysMasterPasswordHash: true,
            twoFASecret: true,
            auth_password_hash: true,
            avatar: true,
            bgImage: true,
            created: true,
            updated: true
          })
          .extend({
            avatar: fileReferenceSchema.nullable(),
            bgImage: fileReferenceSchema.nullable(),
            twoFAEnabled: z.boolean(),
            hasAPIKeysMasterPassword: z.boolean()
          })
      })
    }
  })
  .callback(async ({ db, core, response }) => {
    const user = await db.query.users.findFirst()

    if (!user) {
      return response.unauthorized()
    }

    const sanitized = {
      id: user.id,
      email: user.email,
      emailVisibility: user.emailVisibility,
      verified: user.verified,
      username: user.username,
      name: user.name || '',
      avatar: user.avatar ? await core.storage.getReference(user.avatar) : null,
      dateOfBirth: user.dateOfBirth || '',
      theme: user.theme || 'system',
      color: user.color || '',
      bgTemp: user.bgTemp || '',
      bgImage: user.bgImage
        ? await core.storage.getReference(user.bgImage)
        : null,
      fontFamily: user.fontFamily || '',
      fontScale: user.fontScale || 1,
      borderRadiusMultiplier: user.borderRadiusMultiplier || 1,
      bordered: user.bordered || false,
      language: user.language || 'en',
      dashboardLayout: user.dashboardLayout ?? null,
      hasAPIKeysMasterPassword: Boolean(user.APIKeysMasterPasswordHash),
      twoFAEnabled: Boolean(user.twoFASecret),
      backdropFilters: user.backdropFilters ?? null
    }

    return response.ok({ userData: sanitized })
  })
