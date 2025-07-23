import { decrypt2, encrypt2 } from '@functions/auth/encryption'
import { forgeController, forgeRouter } from '@functions/routes'
import { z } from 'zod/v4'

import { challenge } from '..'
import getDecryptedMaster from '../utils/getDecryptedMaster'

const getAllEntries = forgeController
  .route('GET /')
  .description('Get all API key entries')
  .input({
    query: z.object({
      master: z.string()
    })
  })
  .callback(async ({ pb, query: { master } }) => {
    await getDecryptedMaster(pb, decodeURIComponent(master))

    const entries = await pb.getFullList
      .collection('api_keys__entries')
      .sort(['name'])
      .execute()

    entries.forEach(entry => {
      entry.key = decrypt2(entry.key, process.env.MASTER_KEY!)
        .toString()
        .slice(-4)
    })

    return entries
  })

const checkKeys = forgeController
  .route('GET /check')
  .description('Check if API keys exist')
  .input({
    query: z.object({
      keys: z.string()
    })
  })
  .callback(async ({ pb, query: { keys } }) => {
    const allEntries = await pb.getFullList
      .collection('api_keys__entries')
      .execute()

    return keys
      .split(',')
      .every(key => allEntries.some(entry => entry.keyId === key))
  })

const getEntryById = forgeController
  .route('GET /:id')
  .description('Get API key entry by ID')
  .input({
    params: z.object({
      id: z.string()
    }),
    query: z.object({
      master: z.string()
    })
  })
  .existenceCheck('params', {
    id: 'api_keys__entries'
  })
  .callback(async ({ pb, params: { id }, query: { master } }) => {
    const decryptedMaster = await getDecryptedMaster(
      pb,
      decodeURIComponent(master)
    )

    const entry = await pb.getOne
      .collection('api_keys__entries')
      .id(id)
      .execute()

    if (!entry) {
      throw new Error('Entry not found')
    }

    const decryptedKey = decrypt2(entry.key, process.env.MASTER_KEY!)

    const encryptedKey = encrypt2(decryptedKey, decryptedMaster)

    const encryptedSecondTime = encrypt2(encryptedKey, challenge)

    return encryptedSecondTime
  })

const createEntry = forgeController
  .route('POST /')
  .description('Create a new API key entry')
  .input({
    body: z.object({
      data: z.string()
    })
  })
  .statusCode(201)
  .callback(async ({ pb, body: { data } }) => {
    const decryptedData = JSON.parse(decrypt2(data, challenge))

    const { keyId, name, description, icon, key, master } = decryptedData

    const decryptedMaster = await getDecryptedMaster(pb, master)

    const decryptedKey = decrypt2(key, decryptedMaster)

    const encryptedKey = encrypt2(decryptedKey, process.env.MASTER_KEY!)

    const entry = await pb.create
      .collection('api_keys__entries')
      .data({
        keyId,
        name,
        description,
        icon,
        key: encryptedKey
      })
      .execute()

    entry.key = decryptedKey.slice(-4)

    return entry
  })

const updateEntry = forgeController
  .route('PATCH /:id')
  .description('Update an API key entry')
  .input({
    params: z.object({
      id: z.string()
    }),
    body: z.object({
      data: z.string()
    })
  })
  .existenceCheck('params', {
    id: 'api_keys__entries'
  })
  .callback(async ({ pb, params: { id }, body: { data } }) => {
    const decryptedData = JSON.parse(decrypt2(data, challenge))

    const { keyId, name, description, icon, key, master } = decryptedData

    const decryptedMaster = await getDecryptedMaster(pb, master)

    const decryptedKey = decrypt2(key, decryptedMaster)

    const encryptedKey = encrypt2(decryptedKey, process.env.MASTER_KEY!)

    const updatedEntry = await pb.update
      .collection('api_keys__entries')
      .id(id)
      .data({
        keyId,
        name,
        description,
        icon,
        key: encryptedKey
      })
      .execute()

    updatedEntry.key = decryptedKey.slice(-4)

    return updatedEntry
  })

const deleteEntry = forgeController
  .route('DELETE /:id')
  .description('Delete an API key entry')
  .input({
    params: z.object({
      id: z.string()
    })
  })
  .existenceCheck('params', {
    id: 'api_keys__entries'
  })
  .statusCode(204)
  .callback(({ pb, params: { id } }) =>
    pb.delete.collection('api_keys__entries').id(id).execute()
  )

export default forgeRouter({
  getAllEntries,
  checkKeys,
  getEntryById,
  createEntry,
  updateEntry,
  deleteEntry
})
