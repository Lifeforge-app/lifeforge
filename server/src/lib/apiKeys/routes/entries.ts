import { ClientError, forgeRouter } from '@lifeforge/server-utils'
import z from 'zod'

import { decrypt2, encrypt2 } from '@functions/auth/encryption'

import forge from '../forge'

const get = forge
  .query()
  .description(
    'Retrieve API key by key ID. Only exposable keys can be retrieved.'
  )
  .input({
    query: z.object({
      keyId: z.string()
    })
  })
  .callback(async ({ pb, query: { keyId } }) => {
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
      throw new ClientError('API Key not found', 404)
    }

    if (!entry.exposable) {
      throw new ClientError(`API Key "${entry.keyId}" is not exposable`, 403)
    }

    try {
      const decryptedKey = decrypt2(
        entry.key,
        process.env.MASTER_KEY!
      ).toString()

      return decryptedKey
    } catch {
      throw new Error('Failed to decrypt the API key')
    }
  })

const list = forge
  .query()
  .description('Retrieve all API key entries')
  .input({})
  .callback(async ({ pb }) => {
    const entries = await pb.getFullList
      .collection('entries')
      .sort(['name'])
      .execute()

    entries.forEach(entry => {
      entry.key = decrypt2(entry.key, process.env.MASTER_KEY!)
        .toString()
        .slice(-4)
    })

    return entries
  })

const checkKeys = forge
  .query()
  .description('Verify if API keys exist')
  .input({
    query: z.object({
      keys: z.string()
    })
  })
  .callback(async ({ pb, query: { keys } }) => {
    const allEntries = await pb.getFullList.collection('entries').execute()

    return keys
      .split(',')
      .every(key => allEntries.some(entry => entry.keyId === key))
  })

const create = forge
  .mutation()
  .description('Create a new API key entry')
  .input({
    body: z.object({
      keyId: z.string(),
      name: z.string(),
      icon: z.string(),
      key: z.string(),
      exposable: z.boolean()
    })
  })
  .statusCode(201)
  .callback(async ({ pb, body: { keyId, name, icon, key, exposable } }) => {
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

    return entry
  })

const update = forge
  .mutation()
  .description('Update an existing API key entry')
  .input({
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
  })
  .existenceCheck('query', {
    id: 'entries'
  })
  .callback(
    async ({
      pb,
      query: { id },
      body: { keyId, name, icon, key, exposable, overrideKey }
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

      return updatedEntry
    }
  )

const remove = forge
  .mutation()
  .description('Delete an API key entry')
  .input({
    query: z.object({
      id: z.string()
    })
  })
  .existenceCheck('query', {
    id: 'entries'
  })
  .statusCode(204)
  .callback(({ pb, query: { id } }) =>
    pb.delete.collection('entries').id(id).execute()
  )

export default forgeRouter({
  get,
  list,
  checkKeys,
  create,
  update,
  remove
})
