import schema from '@lib/user/schema'
import z from 'zod'

import { getPB } from '../constants/pb'
import forge from '../forge'

export const me = forge
  .query({
    description: 'Get current user data',
    encrypted: false,
    input: {},
    output: {
      OK: z.object({
        userData: schema.users
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
  .callback(async ({ response }) => {
    const pb = await getPB('user')
    const users = await pb.getList
      .collection('users')
      .page(1)
      .perPage(1)
      .execute()
    const user = users.items[0]

    if (!user) {
      return response.unauthorized()
    }

    const sanitized = {
      id: user.id,
      collectionId: user.collectionId || '',
      collectionName: user.collectionName || '',
      email: user.email,
      emailVisibility: user.emailVisibility,
      verified: user.verified,
      username: user.username,
      name: user.name,
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
      backdropFilters: user.backdropFilters
    }

    return response.ok({ userData: sanitized })
  })
