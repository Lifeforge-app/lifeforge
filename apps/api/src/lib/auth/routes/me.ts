import { createSelectSchema } from 'drizzle-orm/zod'
import z from 'zod'

import { users } from '../../user/schema.drizzle'
import forge from '../forge'

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
            pinnedFontFamilies: true,
            auth_password_hash: true,
            created: true,
            updated: true
          })
          .extend({
            twoFAEnabled: z.boolean(),
            hasAPIKeysMasterPassword: z.boolean()
          })
      }),
      UNAUTHORIZED: true
    }
  })
  .callback(async ({ db, response }) => {
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
      avatar: user.avatar || '',
      dateOfBirth: user.dateOfBirth || '',
      theme: user.theme || 'system',
      color: user.color || '',
      bgTemp: user.bgTemp || '',
      bgImage: user.bgImage || '',
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
