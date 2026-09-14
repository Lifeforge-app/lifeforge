import { getPublicKey } from '@functions/encryption'
import corsAnywhere from '@lib/corsAnywhere'
import dayjs from 'dayjs'
import path from 'path'
import z from 'zod'

import { generateThumbKey } from '@lifeforge/file-storage'
import {
  forgeRouter,
  traceRouteStack,
  writeContractFileToClient
} from '@lifeforge/server-utils'

import { storageProvider } from '../storage'
import forge from './forge'

const welcome = forge
  .query({
    description: 'Welcome to LifeForge API',
    noAuth: true,
    encrypted: false,
    output: {
      OK: z.literal('Get ready to forge your life!')
    }
  })
  .callback(async ({ response }) =>
    response.ok('Get ready to forge your life!')
  )

const ping = forge
  .mutation({
    description: 'Ping the server',
    noAuth: true,
    encrypted: false,
    input: {
      body: z.object({
        timestamp: z.number().min(0)
      })
    },
    output: {
      OK: z.string()
    }
  })
  .callback(async ({ body: { timestamp }, response }) =>
    response.ok(`Pong at ${dayjs(timestamp).format('YYYY-MM-DD HH:mm:ss')}`)
  )

const status = forge
  .query({
    description: 'Get server status',
    noAuth: true,
    encrypted: false,
    rateLimit: false,
    input: {},
    output: {
      OK: z.object({
        environment: z.string()
      })
    }
  })
  .callback(async ({ response }) =>
    response.ok({
      environment: process.env.NODE_ENV || 'development'
    })
  )

const getFiles = forge
  .query({
    description: 'Retrieve stored file or thumbnail from storage provider',
    noAuth: true,
    encrypted: false,
    rateLimit: false,
    input: {
      query: z.object({
        key: z.string(),
        thumb: z.string().optional()
      })
    },
    output: 'custom'
  })
  .callback(async ({ query: { key, thumb }, res }) => {
    const targetKey = thumb ? generateThumbKey(key, thumb) : key
    const fileStream = await storageProvider.get(targetKey)

    if (!fileStream) {
      res.status(404).json({ error: 'File not found' })

      return
    }

    res.setHeader('Content-Type', fileStream.mimeType)

    if (fileStream.size > 0) {
      res.setHeader('Content-Length', fileStream.size)
    }
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable')

    fileStream.stream.pipe(res)
  })

const encryptionPublicKey = forge
  .query({
    description: 'Get server public key for end-to-end encryption',
    noAuth: true,
    encrypted: false,
    input: {},
    output: {
      OK: z.string()
    }
  })
  .callback(async ({ response }) => response.ok(getPublicKey()))

const listRoutes = forge
  .query({
    description: 'List all registered routes',
    noAuth: true,
    encrypted: false,
    input: {},
    output: {
      OK: z.array(
        z.object({
          method: z.string(),
          path: z.string(),
          description: z.string()
        })
      )
    }
  })
  .callback(async ({ req, response }) =>
    response.ok(
      traceRouteStack(req.app._router.stack).map(
        ({ method, path, description }) => ({
          method,
          path,
          description
        })
      )
    )
  )

const coreRoutes = forgeRouter({
  '': welcome,
  locales: (await import('@lib/locales')).default,
  user: (await import('@lib/user')).default,
  apiKeys: (await import('@lib/apiKeys')).default,
  auth: (await import('@lib/auth')).default,
  pixabay: (await import('@lib/pixabay')).default,
  locations: (await import('@lib/locations')).default,
  modules: (await import('@lib/modules')).default,
  ai: (await import('@lib/ai')).default,
  ping,
  status,
  listRoutes,
  files: getFiles,
  corsAnywhere,
  encryptionPublicKey
})

writeContractFileToClient(
  coreRoutes,
  path.resolve(import.meta.dirname, '../../../../../packages/api/src'),
  '.'
)

export default coreRoutes
