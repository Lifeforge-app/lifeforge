import { forgeController, forgeRouter } from '@functions/routes'
import { registerRoutes } from '@functions/routes/functions/forgeRouter'
import traceRouteStack from '@functions/utils/traceRouteStack'
import express from 'express'
import request from 'request'
import { z } from 'zod/v4'

const router = express.Router()

router.get('/', (req, res) => {
  res.json({
    message: 'Welcome to LifeForge API!'
  })
})

const status = forgeController.query
  .description('Get server status')
  .input({})
  .callback(async () => ({
    environment: process.env.NODE_ENV || 'development'
  }))

const getRoot = forgeController.query
  .description('Get root endpoint')
  .input({})
  .callback(async () => 'Welcome to LifeForge API!' as const)

const getMedia = forgeController.query
  .description('Get media file from PocketBase')
  .input({
    query: z.object({
      collectionId: z.string(),
      recordId: z.string(),
      photoId: z.string(),
      thumb: z.string().optional(),
      token: z.string().optional()
    })
  })
  .noDefaultResponse()
  .callback(
    async ({
      query: { collectionId, recordId, photoId, thumb, token },
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
        `${process.env.PB_HOST}/api/files/${collectionId}/${recordId}/${photoId}?${searchParams.toString()}`
      ).pipe(res)
    }
  )

const corsAnywhere = forgeController.query
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

const listRoutes = forgeController.query
  .description('Get all registered routes')
  .input({})
  .callback(async () => traceRouteStack(router.stack))

const appRoutes = forgeRouter({
  achievements: (await import('../apps/achievements')).default,
  calendar: (await import('../apps/calendar')).default,
  todoList: (await import('../apps/todoList')).default,
  ideaBox: (await import('../apps/ideaBox')).default,
  'code-time': (await import('../apps/codeTime')).default,
  booksLibrary: (await import('../apps/booksLibrary')).default,
  wallet: (await import('../apps/wallet')).default,
  wishlist: (await import('../apps/wishlist')).default,
  scoresLibrary: (await import('../apps/scoresLibrary')).default,
  passwords: (await import('../apps/passwords')).default,
  sudoku: (await import('../apps/sudoku')).default,
  virtualWardrobe: (await import('../apps/virtualWardrobe')).default,
  momentVault: (await import('../apps/momentVault')).default,
  movies: (await import('../apps/movies')).default,
  railwayMap: (await import('../apps/railwayMap')).default,
  youtubeSummarizer: (await import('../apps/youtubeSummarizer')).default,
  blog: (await import('../apps/blog')).default,
  locales: (await import('./lib/locales')).default,
  user: (await import('./lib/user')).default,
  apiKeys: (await import('./lib/apiKeys')).default,
  pixabay: (await import('./lib/pixabay')).default,
  locations: (await import('./lib/locations')).default,
  ai: (await import('./lib/ai')).default,
  modules: (await import('./lib/modules')).default,
  backups: (await import('./lib/backups')).default,
  database: (await import('./lib/database')).default,
  _routes: listRoutes,
  status,
  getRoot,
  media: getMedia,
  corsAnywhere
})

router.use('/', registerRoutes(appRoutes))

export type Router = typeof appRoutes

export default router
