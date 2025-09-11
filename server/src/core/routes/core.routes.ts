import { LoggingService } from '@functions/logging/loggingService'
import { forgeController, forgeRouter } from '@functions/routes'
import moment from 'moment'
import z from 'zod/v4'

const welcome = forgeController
  .query()
  .noAuth()
  .description('Welcome message')
  .input({})
  .callback(async () => 'Welcome to LifeForge API!' as const)

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

const getRoot = forgeController
  .query()
  .description('Get root endpoint')
  .input({})
  .callback(async () => 'Welcome to LifeForge API!' as const)

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

      const response = await fetch(
        `${process.env.PB_HOST}/api/files/${collectionId}/${recordId}/${fieldId}?${searchParams.toString()}`
      )

      if (!response.ok) {
        LoggingService.error(
          `Failed to fetch media file: ${response.status} ${response.statusText} for ${collectionId}/${recordId}/${fieldId}`
        )

        return res.status(response.status).end()
      }

      // Forward important headers
      const contentType = response.headers.get('content-type')

      const contentLength = response.headers.get('content-length')

      const lastModified = response.headers.get('last-modified')

      const etag = response.headers.get('etag')

      const cacheControl = response.headers.get('cache-control')

      if (contentType) {
        res.setHeader('Content-Type', contentType)
      }

      if (contentLength) {
        res.setHeader('Content-Length', contentLength)
      }

      if (lastModified) {
        res.setHeader('Last-Modified', lastModified)
      }

      if (etag) {
        res.setHeader('ETag', etag)
      }

      if (cacheControl) {
        res.setHeader('Cache-Control', cacheControl)
      }

      // Stream the response instead of buffering
      if (response.body) {
        const reader = response.body.getReader()

        try {
          while (true) {
            const { done, value } = await reader.read()

            if (done) break

            res.write(Buffer.from(value))
          }
          res.end()
        } catch (error) {
          LoggingService.error(`Error streaming media file: ${error}`)

          if (!res.headersSent) {
            res.status(500).end()
          }
        } finally {
          reader.releaseLock()
        }
      } else {
        // Fallback for environments without streaming support
        const buffer = await response.arrayBuffer()

        res.end(Buffer.from(buffer))
      }
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
  locales: (await import('../../lib/locales')).default,
  user: (await import('../../lib/user')).default,
  apiKeys: (await import('../../lib/apiKeys')).default,
  pixabay: (await import('../../lib/pixabay')).default,
  locations: (await import('../../lib/locations')).default,
  modules: (await import('../../lib/modules')).default,
  backups: (await import('../../lib/backups')).default,
  database: (await import('../../lib/database')).default,
  ping,
  status,
  getRoot,
  media: getMedia,
  corsAnywhere
})

export default coreRoutes
