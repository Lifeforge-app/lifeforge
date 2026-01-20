import corsAnywhere from '@lib/corsAnywhere'
import { forgeRouter } from '@lifeforge/server-utils'
import dayjs from 'dayjs'
import request from 'request'
import z from 'zod'

import { getPublicKey } from '@functions/encryption'

import forge from './forge'

const welcome = forge
  .query()
  .noAuth()
  .noEncryption()
  .description('Welcome to LifeForge API')
  .input({})
  .callback(async () => 'Get ready to forge your life!' as const)

const ping = forge
  .mutation()
  .noAuth()
  .noEncryption()
  .description('Ping the server')
  .input({
    body: z.object({
      timestamp: z.number().min(0)
    })
  })
  .callback(
    async ({ body: { timestamp } }) =>
      `Pong at ${dayjs(timestamp).format('YYYY-MM-DD HH:mm:ss')}`
  )

const status = forge
  .query()
  .noAuth()
  .noEncryption()
  .description('Get server status')
  .input({})
  .callback(async () => ({
    environment: process.env.NODE_ENV || 'development'
  }))

const getMedia = forge
  .query()
  .noAuth()
  .noEncryption()
  .description('Retrieve media file from PocketBase')
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

const encryptionPublicKey = forge
  .query()
  .noAuth()
  .noEncryption()
  .description('Get server public key for end-to-end encryption')
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
