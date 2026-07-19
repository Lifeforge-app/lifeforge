import { getPublicKey } from '@functions/encryption'
import corsAnywhere from '@lib/corsAnywhere'
import dayjs from 'dayjs'
import { Readable } from 'node:stream'
import path from 'path'
import z from 'zod'

import {
  forgeRouter,
  traceRouteStack,
  writeContractFileToClient
} from '@lifeforge/server-utils'

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

const getMedia = forge
  .query({
    description: 'Retrieve media file from PocketBase',
    noAuth: true,
    encrypted: false,

    input: {
      query: z.object({
        collectionId: z.string(),
        recordId: z.string(),
        fieldId: z.string(),
        thumb: z.string().optional(),
        token: z.string().optional()
      })
    },
    output: 'custom'
  })
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

      const fileRes = await fetch(
        `${process.env.PB_HOST}/api/files/${collectionId}/${recordId}/${fieldId}?${searchParams.toString()}`
      )

      if (!fileRes.ok) {
        res.status(fileRes.status).send(await fileRes.text())
        return
      }

      for (const [key, value] of fileRes.headers.entries()) {
        res.setHeader(key, value)
      }

      if (fileRes.body) {
        Readable.fromWeb(
          fileRes.body as Parameters<typeof Readable.fromWeb>[0]
        ).pipe(res)
      } else {
        res.end()
      }
    }
  )

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
  backups: (await import('@lib/backups')).default,
  database: (await import('@lib/database')).default,
  modules: (await import('@lib/modules')).default,
  ai: (await import('@lib/ai')).default,
  ping,
  status,
  listRoutes,
  media: getMedia,
  corsAnywhere,
  encryptionPublicKey
})

writeContractFileToClient(
  coreRoutes,
  path.resolve(import.meta.dirname, '../../../../../packages/api/src'),
  '.'
)

export default coreRoutes
