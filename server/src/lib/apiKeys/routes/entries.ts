import z from 'zod'

import { decrypt2, encrypt2 } from '@functions/auth/encryption'
import { forgeController, forgeRouter } from '@functions/routes'
import { ClientError } from '@functions/routes/utils/response'

const get = forgeController
  .query()
  .description({
    en: 'Retrieve API key by key ID. Only exposable keys can be retrieved.',
    ms: 'Dapatkan kunci API mengikut ID kunci. Hanya kunci yang boleh didedahkan boleh diperoleh.',
    'zh-CN': '通过密钥ID获取API密钥。只有可公开的密钥才能被获取。',
    'zh-TW': '透過密鑰ID獲取API密鑰。只有可公開的密鑰才能被獲取。'
  })
  .input({
    query: z.object({
      keyId: z.string()
    })
  })
  .callback(async ({ pb, query: { keyId } }) => {
    const entry = await pb.getFirstListItem
      .collection('api_keys__entries')
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

const list = forgeController
  .query()
  .description({
    en: 'Retrieve all API key entries',
    ms: 'Dapatkan semua entri kunci API',
    'zh-CN': '获取所有API密钥条目',
    'zh-TW': '獲取所有API密鑰條目'
  })
  .input({})
  .callback(async ({ pb }) => {
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
  .query()
  .description({
    en: 'Verify if API keys exist',
    ms: 'Sahkan jika kunci API wujud',
    'zh-CN': '验证API密钥是否存在',
    'zh-TW': '驗證API密鑰是否存在'
  })
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

const create = forgeController
  .mutation()
  .description({
    en: 'Create a new API key entry',
    ms: 'Cipta entri kunci API baharu',
    'zh-CN': '创建新的API密钥条目',
    'zh-TW': '創建新的API密鑰條目'
  })
  .input({
    body: z.object({
      keyId: z.string(),
      name: z.string(),
      description: z.string(),
      icon: z.string(),
      key: z.string(),
      exposable: z.boolean()
    })
  })
  .statusCode(201)
  .callback(async ({ pb, body: { keyId, name, icon, key, exposable } }) => {
    const encryptedKey = encrypt2(key, process.env.MASTER_KEY!)

    const entry = await pb.create
      .collection('api_keys__entries')
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

const update = forgeController
  .mutation()
  .description({
    en: 'Update an existing API key entry',
    ms: 'Kemas kini entri kunci API sedia ada',
    'zh-CN': '更新现有的API密钥条目',
    'zh-TW': '更新現有的API密鑰條目'
  })
  .input({
    query: z.object({
      id: z.string()
    }),
    body: z.object({
      keyId: z.string(),
      name: z.string(),
      description: z.string(),
      icon: z.string(),
      key: z.string(),
      exposable: z.boolean(),
      overrideKey: z.boolean()
    })
  })
  .existenceCheck('query', {
    id: 'api_keys__entries'
  })
  .callback(
    async ({
      pb,
      query: { id },
      body: { keyId, name, icon, key, exposable, overrideKey }
    }) => {
      const encryptedKey = encrypt2(key, process.env.MASTER_KEY!)

      const updatedEntry = await pb.update
        .collection('api_keys__entries')
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

const remove = forgeController
  .mutation()
  .description({
    en: 'Delete an API key entry',
    ms: 'Padam entri kunci API',
    'zh-CN': '删除API密钥条目',
    'zh-TW': '刪除API密鑰條目'
  })
  .input({
    query: z.object({
      id: z.string()
    })
  })
  .existenceCheck('query', {
    id: 'api_keys__entries'
  })
  .statusCode(204)
  .callback(({ pb, query: { id } }) =>
    pb.delete.collection('api_keys__entries').id(id).execute()
  )

export default forgeRouter({
  get,
  list,
  checkKeys,
  create,
  update,
  remove
})
