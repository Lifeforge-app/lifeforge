import {
  connectToPocketBase,
  validateEnvironmentVariables
} from '@functions/database/dbUtils'
import z from 'zod'

import forge from '../forge'

const UserDataSchema = z.object({
  id: z.string(),
  collectionId: z.string(),
  collectionName: z.string(),
  email: z.string(),
  emailVisibility: z.boolean(),
  verified: z.boolean(),
  username: z.string(),
  name: z.string(),
  avatar: z.string(),
  dateOfBirth: z.string(),
  theme: z.enum(['system', 'light', 'dark']),
  color: z.string(),
  bgTemp: z.string(),
  bgImage: z.string(),
  fontFamily: z.string(),
  fontScale: z.number(),
  borderRadiusMultiplier: z.number(),
  bordered: z.boolean(),
  language: z.string(),
  dashboardLayout: z.unknown(),
  hasAPIKeysMasterPassword: z.boolean(),
  twoFAEnabled: z.boolean()
})

export const me = forge
  .query({
    description: 'Get current user data',
    encrypted: false,
    input: {},
    output: {
      OK: z.object({
        userData: UserDataSchema
      }),
      UNAUTHORIZED: true
    }
  })
  .callback(async ({ response }) => {
    const config = validateEnvironmentVariables()
    const pb = await connectToPocketBase(config)
    const users = await pb.collection('users').getList(1, 1)
    const user = users.items[0] as unknown as Record<string, unknown> | undefined

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
      theme: (user.theme as string) || 'system',
      color: (user.color as string) || '',
      bgTemp: (user.bgTemp as string) || '',
      bgImage: (user.bgImage as string) || '',
      fontFamily: (user.fontFamily as string) || '',
      fontScale: (user.fontScale as number) || 1,
      borderRadiusMultiplier: (user.borderRadiusMultiplier as number) || 1,
      bordered: (user.bordered as boolean) || false,
      language: (user.language as string) || 'en',
      dashboardLayout: user.dashboardLayout ?? null,
      hasAPIKeysMasterPassword: Boolean(user.APIKeysMasterPasswordHash),
      twoFAEnabled: Boolean(user.twoFASecret)
    } as z.infer<typeof UserDataSchema>

    return response.ok({ userData: sanitized })
  })
