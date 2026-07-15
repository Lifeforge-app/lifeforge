import { encrypt } from '@functions/auth/encryption'
import { OAUTH_PROVIDER_CONFIGS } from '@lib/auth/constants/oauth_providers'
import { getPB } from '@lib/auth/constants/pb'
import forge from '@lib/auth/forge'
import { z } from 'zod'

import schema from '../../schema'

const MASTER_KEY = process.env.MASTER_KEY!

export const listEnabled = forge
  .query({
    description: 'List enabled OAuth providers for the login portal',
    noAuth: true,
    encrypted: false,
    input: {},
    output: {
      OK: z.array(
        schema.oauth_providers
          .pick({
            provider: true
          })
          .extend({
            icon: z.string(),
            name: z.string()
          })
      )
    }
  })
  .callback(async ({ response }) => {
    const pb = await getPB()
    const records = await pb.getFullList
      .collection('oauth_providers')
      .filter([
        {
          field: 'enabled',
          operator: '=',
          value: true
        }
      ])
      .execute()

    return response.ok(
      records.map(record => {
        const config = OAUTH_PROVIDER_CONFIGS[record.provider]

        return {
          provider: record.provider,
          icon: config.icon,
          name: config.name
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
  .callback(async ({ response, pb }) => {
    const records = await pb.getFullList.collection('oauth_providers').execute()

    return response.ok(
      Object.entries(OAUTH_PROVIDER_CONFIGS).map(([provider, config]) => {
        const record = records.find(r => r.provider === provider)

        return {
          id: record?.id || null,
          provider,
          configured: !!record,
          enabled: record?.enabled || false,
          updated: record?.updated || null,
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
  .callback(async ({ query: { provider }, body, response, pb }) => {
    if (!(provider in OAUTH_PROVIDER_CONFIGS)) {
      return response.badRequest('Unsupported provider')
    }

    const record = await pb.getFirstListItem
      .collection('oauth_providers')
      .filter([
        {
          field: 'provider',
          operator: '=',
          value: provider
        }
      ])
      .execute()
      .catch(() => null)

    const data = {
      provider,
      enabled: true,
      client_id: body.clientId
        ? encrypt(Buffer.from(body.clientId), MASTER_KEY).toString('base64')
        : undefined,
      client_secret: body.clientSecret
        ? encrypt(Buffer.from(body.clientSecret), MASTER_KEY).toString('base64')
        : undefined
    }

    if (record) {
      await pb.update
        .collection('oauth_providers')
        .id(record.id)
        .data(data)
        .execute()
    } else {
      await pb.create.collection('oauth_providers').data(data).execute()
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
    existenceCheck: {
      query: {
        id: 'oauth_providers'
      }
    },
    output: {
      NO_CONTENT: true,
      NOT_FOUND: true
    }
  })
  .callback(async ({ query: { id }, response, pb }) => {
    const record = await pb.getOne
      .collection('oauth_providers')
      .id(id)
      .execute()

    await pb.update
      .collection('oauth_providers')
      .id(id)
      .data({ enabled: !record.enabled })
      .execute()

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
    existenceCheck: {
      query: {
        id: 'oauth_providers'
      }
    },
    output: {
      NO_CONTENT: true,
      NOT_FOUND: true
    }
  })
  .callback(async ({ query: { id }, response, pb }) => {
    await pb.delete.collection('oauth_providers').id(id).execute()

    return response.noContent()
  })
