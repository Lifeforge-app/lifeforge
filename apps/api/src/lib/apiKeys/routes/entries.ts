import { decrypt2, encrypt2 } from '@functions/auth/encryption'
import { eq } from 'drizzle-orm'
import { createSelectSchema } from 'drizzle-orm/zod'
import z from 'zod'

import { forgeRouter } from '@lifeforge/server-utils'

import forge from '../forge'
import { apiKeysEntries } from '../schema.drizzle'

const entrySchema = createSelectSchema(apiKeysEntries).extend({
  created: z.string(),
  updated: z.string()
})

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
  .callback(async ({ db, query: { keyId }, response }) => {
    const entry = await db.query.apiKeysEntries.findFirst({
      where: { keyId }
    })

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
      OK: z.array(entrySchema)
    }
  })
  .callback(async ({ db, response }) => {
    const entries = await db.query.apiKeysEntries.findMany({
      orderBy: { name: 'asc' }
    })

    const mappedEntries = entries.map(entry => ({
      id: entry.id,
      keyId: entry.keyId,
      name: entry.name,
      icon: entry.icon,
      key: decrypt2(entry.key, process.env.MASTER_KEY!)
        .toString()
        .slice(-4),
      exposable: entry.exposable,
      created: entry.created.toISOString(),
      updated: entry.updated.toISOString()
    }))

    return response.ok(mappedEntries)
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
  .callback(async ({ query: { keys }, core: { api }, response }) => {
    for (const key of keys.split(',')) {
      try {
        await api.getAPIKey(key)
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
      CREATED: entrySchema
    }
  })
  .callback(
    async ({ db, body: { keyId, name, icon, key, exposable }, response }) => {
      const encryptedKey = encrypt2(key, process.env.MASTER_KEY!)

      const [entry] = await db
        .insert(apiKeysEntries)
        .values({
          keyId,
          name,
          icon,
          exposable,
          key: encryptedKey
        })
        .returning()

      return response.created({
        ...entry,
        key: key.slice(-4),
        created: entry.created.toISOString(),
        updated: entry.updated.toISOString()
      })
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
    output: {
      OK: entrySchema,
      NOT_FOUND: true
    }
  })
  .callback(
    async ({
      db,
      query: { id },
      body: { keyId, name, icon, key, exposable, overrideKey },
      response
    }) => {
      const encryptedKey = encrypt2(key, process.env.MASTER_KEY!)

      const [updatedEntry] = await db
        .update(apiKeysEntries)
        .set({
          keyId,
          name,
          icon,
          exposable,
          ...(overrideKey ? { key: encryptedKey } : {}),
          updated: new Date()
        })
        .where(eq(apiKeysEntries.id, id))
        .returning()

      if (!updatedEntry) {
        return response.notFound()
      }

      return response.ok({
        ...updatedEntry,
        key: key.slice(-4),
        created: updatedEntry.created.toISOString(),
        updated: updatedEntry.updated.toISOString()
      })
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
    output: {
      NO_CONTENT: true,
      NOT_FOUND: true
    }
  })
  .callback(async ({ db, query: { id }, response }) => {
    const [deleted] = await db
      .delete(apiKeysEntries)
      .where(eq(apiKeysEntries.id, id))
      .returning()

    if (!deleted) {
      return response.notFound()
    }

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
