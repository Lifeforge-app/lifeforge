import { getPublicKey } from '@functions/encryption'
import corsAnywhere from '@lib/corsAnywhere'
import dayjs from 'dayjs'
import path from 'path'
import z from 'zod'

import { forgeRouter, writeContractFileToClient } from '@lifeforge/server-utils'

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

const coreRoutes = forgeRouter({
  '': welcome,
  locales: (await import('@lib/locales')).default,
  user: (await import('@lib/user')).default,
  fonts: (await import('@lib/fonts')).default,
  apiKeys: (await import('@lib/apiKeys')).default,
  auth: (await import('@lib/auth')).default,
  pixabay: (await import('@lib/pixabay')).default,
  locations: (await import('@lib/locations')).default,
  modules: (await import('@lib/modules')).default,
  ai: (await import('@lib/ai')).default,
  files: (await import('@lib/files')).default,
  ping,
  status,
  corsAnywhere,
  encryptionPublicKey
})

writeContractFileToClient(
  coreRoutes,
  path.resolve(import.meta.dirname, '../../../../../packages/api/src'),
  '.'
)

export default coreRoutes
