import { LoggingService } from '@functions/logging/loggingService'
import { forgeController, forgeRouter } from '@functions/routes'
import moment from 'moment'
import request from 'request'
import z from 'zod'

const welcome = forgeController
  .query()
  .noAuth()
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
      `Pong at ${moment(timestamp).format('YYYY-MM-DD HH:mm:ss')}`
  )

const status = forgeController
  .query()
  .noAuth()
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

const corsAnywhere = forgeController
  .query()
  .description({
    en: 'CORS Anywhere - Fetch external URL content',
    ms: 'CORS Anywhere - Dapatkan kandungan URL luaran',
    'zh-CN': 'CORS Anywhere - 获取外部URL内容',
    'zh-TW': 'CORS Anywhere - 獲取外部URL內容'
  })
  .input({
    query: z.object({
      url: z.url()
    })
  })
  .callback(async ({ query: { url } }) => {
    const response = await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'
      }
    }).catch(() => {
      LoggingService.error(`Failed to fetch URL: ${url}`)
    })

    if (!response) {
      return
    }

    if (!response.ok) {
      throw new Error(`Failed to fetch URL: ${url}`)
    }

    if (response.headers.get('content-type')?.includes('application/json')) {
      const json = await response.json()

      return json
    }

    return response.text()
  })

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
  corsAnywhere
})

export default coreRoutes
