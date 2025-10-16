import { LoggingService } from '@functions/logging/loggingService'
import { forgeController, forgeRouter } from '@functions/routes'
import moment from 'moment'
import request from 'request'
import z from 'zod'

const welcome = forgeController
  .query()
  .noAuth()
  .description('Welcome message')
  .input({})
  .callback(async () => 'Get ready to forge your life!' as const)

const ping = forgeController
  .mutation()
  .noAuth()
  .description('Ping the server')
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
  .description('Get server status')
  .input({})
  .callback(async () => ({
    environment: process.env.NODE_ENV || 'development'
  }))

const getMedia = forgeController
  .query()
  .noAuth()
  .description('Get media file from PocketBase')
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
  .description('Proxy request to bypass CORS')
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
  ai: (await import('@lib/ai')).default,
  ping,
  status,
  getRoot,
  media: getMedia,
  corsAnywhere
})

export default coreRoutes
