import corsAnywhere from '@lib/corsAnywhere'
import { forgeRouter } from '@lifeforge/server-sdk'
import dayjs from 'dayjs'
import request from 'request'
import z from 'zod'

import { getPublicKey } from '@functions/encryption'
import { forgeController } from '@functions/routes'

const welcome = forgeController
  .query()
  .noAuth()
  .noEncryption()
  .description({
    en: 'Welcome to LifeForge API',
    ms: 'Selamat datang ke API LifeForge',
    'zh-CN': '欢迎使用LifeForge API',
    'zh-TW': '歡迎使用LifeForge API'
  })
  .input({})
  .callback(async () => 'Get ready to forge your life!' as const)

const ping = forgeController
  .mutation()
  .noAuth()
  .noEncryption()
  .description({
    en: 'Ping the server',
    ms: 'Ping pelayan',
    'zh-CN': '向伺服器发送Ping',
    'zh-TW': '向伺服器發送Ping'
  })
  .input({
    body: z.object({
      timestamp: z.number().min(0)
    })
  })
  .callback(
    async ({ body: { timestamp } }) =>
      `Pong at ${dayjs(timestamp).format('YYYY-MM-DD HH:mm:ss')}`
  )

const status = forgeController
  .query()
  .noAuth()
  .noEncryption()
  .description({
    en: 'Get server status',
    ms: 'Dapatkan status pelayan',
    'zh-CN': '获取服务器状态',
    'zh-TW': '獲取伺服器狀態'
  })
  .input({})
  .callback(async () => ({
    environment: process.env.NODE_ENV || 'development'
  }))

const getMedia = forgeController
  .query()
  .noAuth()
  .noEncryption()
  .description({
    en: 'Retrieve media file from PocketBase',
    ms: 'Dapatkan fail media dari PocketBase',
    'zh-CN': '从PocketBase获取媒体文件',
    'zh-TW': '從PocketBase獲取媒體文件'
  })
  .input({
    query: z.object({
      collectionId: z.string(),
      recordId: z.string(),
      fieldId: z.string(),
      thumb: z.string().optional(),
      token: z.string().optional()
    })
  })
  .noDefaultResponse()
  .callback(
    async ({
      query: { collectionId, recordId, fieldId, thumb, token },
      res
    }) => {
      const searchParams = new URLSearchParams()

      if (thumb) {
        searchParams.append('thumb', thumb)
      }

      if (token) {
        searchParams.append('token', token)
      }

      request(
        `${process.env.PB_HOST}/api/files/${collectionId}/${recordId}/${fieldId}?${searchParams.toString()}`
      ).pipe(res)
    }
  )

const encryptionPublicKey = forgeController
  .query()
  .noAuth()
  .noEncryption()
  .description({
    en: 'Get server public key for end-to-end encryption',
    ms: 'Dapatkan kunci awam pelayan untuk penyulitan hujung-ke-hujung',
    'zh-CN': '获取服务器公钥用于端到端加密',
    'zh-TW': '獲取伺服器公鑰用於端到端加密'
  })
  .input({})
  .callback(async () => getPublicKey())

const coreRoutes = forgeRouter({
  '': welcome,
  locales: (await import('@lib/locales')).default,
  user: (await import('@lib/user')).default,
  apiKeys: (await import('@lib/apiKeys')).default,
  pixabay: (await import('@lib/pixabay')).default,
  locations: (await import('@lib/locations')).default,
  backups: (await import('@lib/backups')).default,
  database: (await import('@lib/database')).default,
  modules: (await import('@lib/modules')).default,
  ai: (await import('@lib/ai')).default,
  ping,
  status,
  media: getMedia,
  corsAnywhere,
  encryptionPublicKey
})

export default coreRoutes
