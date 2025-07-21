import { forgeController } from '@functions/forgeController'
import { registerRoutes } from '@functions/forgeRouter'
import forgeRouter from '@functions/forgeRouter'
import { successWithBaseResponse } from '@functions/response'
import traceRouteStack from '@functions/traceRouteStack'
import express from 'express'
import request from 'request'
import { z } from 'zod/v4'

import { RoutesControllersSchemas } from 'shared/types/controllers'

const router = express.Router()

router.get('/status', async (req, res) => {
  successWithBaseResponse(res, {
    environment: process.env.NODE_ENV
  })
})

router.get('/', (_, res) => {
  successWithBaseResponse(res, true)
})

const getMedia = forgeController
  .route('GET /media/:collectionId/:entriesId/:photoId')
  .description('Get media file from PocketBase')
  .schema({
    params: z.object({
      collectionId: z.string(),
      entriesId: z.string(),
      photoId: z.string()
    }),
    query: z.object({
      thumb: z.string().optional(),
      token: z.string().optional()
    }),
    response: z.any()
  })
  .noDefaultResponse()
  .callback(
    async ({
      params: { collectionId, entriesId, photoId },
      query: { thumb, token },
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
        `${process.env.PB_HOST}/api/files/${collectionId}/${entriesId}/${photoId}?${searchParams.toString()}`
      ).pipe(res)
    }
  )

const corsAnywhere = forgeController
  .route('GET /cors-anywhere')
  .description('Proxy request to bypass CORS')
  .schema({
    query: z.object({
      url: z.url()
    }),
    response: z.any()
  })
  .callback(async ({ query: { url } }) => {
    const response = await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'
      }
    }).catch(error => {
      console.error(`Error fetching URL: ${url}`, error)
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

const getAllRoutes = forgeController
  .route('GET /_routes')
  .description('Get all registered routes')
  .schema(RoutesControllersSchemas.Routes.getAllRoutes)
  .callback(async () => traceRouteStack(router.stack))

const newRoutes = forgeRouter({
  '/achievements': (await import('../../apps/achievements')).default,
  '/calendar': (await import('../../apps/calendar')).default,
  '/todo-list': (await import('../../apps/todoList')).default,
  '/idea-box': (await import('../../apps/ideaBox')).default,
  '/code-time': (await import('../../apps/codeTime')).default,
  '/books-library': (await import('../../apps/booksLibrary')).default,
  '/wallet': (await import('../../apps/wallet')).default,
  '/wishlist': (await import('../../apps/wishlist')).default,
  '/music': (await import('../../apps/music')).default,
  '/scores-library': (await import('../../apps/scoresLibrary')).default,
  '/passwords': (await import('../../apps/passwords')).default,
  '/sudoku': (await import('../../apps/sudoku')).default,
  '/virtual-wardrobe': (await import('../../apps/virtualWardrobe')).default,
  '/moment-vault': (await import('../../apps/momentVault')).default,
  '/movies': (await import('../../apps/movies')).default,
  '/railway-map': (await import('../../apps/railwayMap')).default,
  '/youtube-summarizer': (await import('../../apps/youtubeSummarizer')).default,
  '/blog': (await import('../../apps/blog')).default,
  '/locales': (await import('../lib/locales')).default,
  '/user': (await import('../lib/user')).default,
  '/api-keys': (await import('../lib/apiKeys')).default,
  '/pixabay': (await import('../lib/pixabay')).default,
  '/locations': (await import('../lib/locations')).default,
  '/ai': (await import('../lib/ai')).default,
  '/modules': (await import('../lib/modules')).default,
  '/backups': (await import('../lib/backups')).default,
  '/database': (await import('../lib/database')).default,
  getMedia,
  corsAnywhere,
  getAllRoutes
})

router.use('/', registerRoutes(newRoutes))

export default router
