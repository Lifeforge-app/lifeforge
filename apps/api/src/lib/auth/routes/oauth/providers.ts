import { encrypt } from '@functions/auth/encryption'
import { OAUTH_PROVIDER_CONFIGS } from '@lib/auth/constants/oauth_providers'
import forge from '@lib/auth/forge'
import { eq } from 'drizzle-orm'
import { z } from 'zod'

import { authOAuthProviders } from '../../schema.drizzle'

const MASTER_KEY = process.env.MASTER_KEY!

export const listEnabled = forge
  .query({
    description: 'List enabled OAuth providers for the login portal',
    noAuth: true,
    encrypted: false,
    input: {},
    output: {
      OK: z.array(
        z.object({
          provider: z.string(),
          icon: z.string(),
          name: z.string()
        })
      )
    }
  })
  .callback(async ({ db, response }) => {
    const records = await db.query.authOAuthProviders.findMany({
      where: { enabled: true }
    })

    return response.ok(
      records.map(record => {
        const config = OAUTH_PROVIDER_CONFIGS[record.provider]

        return {
          provider: record.provider,
          icon: config?.icon || '',
          name: config?.name || record.provider
        }
      })
    )
  })

export const listOptions = forge
  .query({
    description: 'List all available OAuth provider options for configuration',
    output: {
      OK: z.array(
        z.object({
          id: z.string().nullable(),
          provider: z.string(),
          configured: z.boolean(),
          enabled: z.boolean(),
          icon: z.string(),
          name: z.string(),
          updated: z.string().nullable()
        })
      )
    }
  })
  .callback(async ({ db, response }) => {
    const records = await db.query.authOAuthProviders.findMany()

    return response.ok(
      Object.entries(OAUTH_PROVIDER_CONFIGS).map(([provider, config]) => {
        const record = records.find(r => r.provider === provider)

        return {
          id: record?.id || null,
          provider,
          configured: !!record,
          enabled: record?.enabled || false,
          updated: record?.updated ? record.updated.toISOString() : null,
          icon: config.icon,
          name: config.name
        }
      })
    )
  })

export const upsert = forge
  .mutation({
    description: 'Update OAuth provider configuration',
    input: {
      query: z.object({
        provider: z.string()
      }),
      body: z.object({
        clientId: z.string(),
        clientSecret: z.string()
      })
    },
    output: {
      NO_CONTENT: true,
      BAD_REQUEST: z.string(),
      NOT_FOUND: true
    }
  })
  .callback(async ({ db, query: { provider }, body, response }) => {
    if (!(provider in OAUTH_PROVIDER_CONFIGS)) {
      return response.badRequest('Unsupported provider')
    }

    const record = await db.query.authOAuthProviders.findFirst({
      where: { provider }
    })

    const encryptedClientId = body.clientId
      ? encrypt(Buffer.from(body.clientId), MASTER_KEY).toString('base64')
      : undefined
    const encryptedClientSecret = body.clientSecret
      ? encrypt(Buffer.from(body.clientSecret), MASTER_KEY).toString('base64')
      : undefined

    if (record) {
      await db
        .update(authOAuthProviders)
        .set({
          enabled: true,
          client_id: encryptedClientId,
          client_secret: encryptedClientSecret,
          updated: new Date()
        })
        .where(eq(authOAuthProviders.id, record.id))
    } else {
      await db.insert(authOAuthProviders).values({
        provider,
        enabled: true,
        client_id: encryptedClientId,
        client_secret: encryptedClientSecret
      })
    }

    return response.noContent()
  })

export const toggle = forge
  .mutation({
    description: 'Toggle OAuth provider enabled status',
    input: {
      query: z.object({
        id: z.string()
      })
    },
    output: {
      NO_CONTENT: true,
      NOT_FOUND: true
    }
  })
  .callback(async ({ db, query: { id }, response }) => {
    const record = await db.query.authOAuthProviders.findFirst({
      where: { id }
    })

    if (!record) {
      return response.notFound()
    }

    await db
      .update(authOAuthProviders)
      .set({ enabled: !record.enabled, updated: new Date() })
      .where(eq(authOAuthProviders.id, id))

    return response.noContent()
  })

export const remove = forge
  .mutation({
    description: 'Delete OAuth provider configuration',
    input: {
      query: z.object({
        id: z.string()
      })
    },
    output: {
      NO_CONTENT: true,
      NOT_FOUND: true
    }
  })
  .callback(async ({ db, query: { id }, response }) => {
    const [deleted] = await db
      .delete(authOAuthProviders)
      .where(eq(authOAuthProviders.id, id))
      .returning()

    if (!deleted) {
      return response.notFound()
    }

    return response.noContent()
  })
