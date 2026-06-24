import { decrypt2, encrypt2 } from '@functions/auth/encryption'
import z from 'zod'

import { forgeRouter } from '@lifeforge/server-utils'

import forge from '../forge'
import schema from '../schema'

const get = forge
  .query({
    description:
      'Retrieve API key by key ID. Only exposable keys can be retrieved.',
    input: {
      query: z.object({
        keyId: z.string()
      })
    },
    output: {
      OK: z.string().nullable(),
      FORBIDDEN: true
    }
  })
  .callback(async ({ pb, query: { keyId }, response }) => {
    const entry = await pb.getFirstListItem
      .collection('entries')
      .filter([
        {
          field: 'keyId',
          operator: '=',
          value: keyId
        }
      ])
      .execute()
      .catch(() => null)

    if (!entry) {
      return response.ok(null)
    }

    if (!entry.exposable) {
      return response.forbidden()
    }

    try {
      const decryptedKey = decrypt2(
        entry.key,
        process.env.MASTER_KEY!
      ).toString()

      return response.ok(decryptedKey)
    } catch {
      return response.forbidden()
    }
  })

const list = forge
  .query({
    description: 'Retrieve all API key entries',
    input: {},
    output: {
      OK: z.array(schema.entries)
    }
  })
  .callback(async ({ pb, response }) => {
    const entries = await pb.getFullList
      .collection('entries')
      .sort(['name'])
      .execute()

    entries.forEach(entry => {
      entry.key = decrypt2(entry.key, process.env.MASTER_KEY!)
        .toString()
        .slice(-4)
    })

    return response.ok(entries)
  })

const checkKeys = forge
  .query({
    description: 'Verify if API keys exist.',
    input: {
      query: z.object({
        keys: z.string()
      })
    },
    output: {
      OK: z.boolean()
    }
  })
  .callback(async ({ pb, query: { keys }, core: { api }, response }) => {
    for (const key of keys.split(',')) {
      try {
        await api.getAPIKey(key, pb)
      } catch {
        return response.ok(false)
      }
    }

    return response.ok(true)
  })

const create = forge
  .mutation({
    description: 'Create a new API key entry',
    input: {
      body: z.object({
        keyId: z.string(),
        name: z.string(),
        icon: z.string(),
        key: z.string(),
        exposable: z.boolean()
      })
    },
    output: {
      CREATED: schema.entries
    }
  })
  .callback(
    async ({ pb, body: { keyId, name, icon, key, exposable }, response }) => {
      const encryptedKey = encrypt2(key, process.env.MASTER_KEY!)

      const entry = await pb.create
        .collection('entries')
        .data({
          keyId,
          name,
          icon,
          exposable,
          key: encryptedKey
        })
        .execute()

      entry.key = key.slice(-4)

      return response.created(entry)
    }
  )

const update = forge
  .mutation({
    description: 'Update an existing API key entry',
    input: {
      query: z.object({
        id: z.string()
      }),
      body: z.object({
        keyId: z.string(),
        name: z.string(),
        icon: z.string(),
        key: z.string(),
        exposable: z.boolean(),
        overrideKey: z.boolean()
      })
    },
    existenceCheck: {
      query: {
        id: 'entries'
      }
    },
    output: {
      OK: schema.entries,
      NOT_FOUND: true
    }
  })
  .callback(
    async ({
      pb,
      query: { id },
      body: { keyId, name, icon, key, exposable, overrideKey },
      response
    }) => {
      const encryptedKey = encrypt2(key, process.env.MASTER_KEY!)

      const updatedEntry = await pb.update
        .collection('entries')
        .id(id)
        .data({
          keyId,
          name,
          icon,
          exposable,
          key: overrideKey ? encryptedKey : undefined
        })
        .execute()

      updatedEntry.key = key.slice(-4)

      return response.ok(updatedEntry)
    }
  )

const remove = forge
  .mutation({
    description: 'Delete an API key entry',
    input: {
      query: z.object({
        id: z.string()
      })
    },
    existenceCheck: {
      query: {
        id: 'entries'
      }
    },
    output: {
      NO_CONTENT: true,
      NOT_FOUND: true
    }
  })
  .callback(async ({ pb, query: { id }, response }) => {
    await pb.delete.collection('entries').id(id).execute()

    return response.noContent()
  })

export default forgeRouter({
  get,
  list,
  checkKeys,
  create,
  update,
  remove
})
