import {
  bulkRegisterControllers,
  forgeController
} from '@functions/forgeController'
import { successWithBaseResponse } from '@functions/response'
import traceRouteStack from '@functions/traceRouteStack'
import express from 'express'
import fs from 'fs'
import path from 'path'
import request from 'request'
import { z } from 'zod/v4'

import { RoutesControllersSchemas } from 'shared/types/controllers'

const LIB_ROUTES = JSON.parse(
  fs.readFileSync(
    path.resolve(process.cwd(), 'src/core/routes/lib.routes.json'),
    'utf-8'
  )
) as Record<string, string>

const MODULE_ROUTES = JSON.parse(
  fs.readFileSync(
    path.resolve(process.cwd(), 'src/core/routes/module.routes.json'),
    'utf-8'
  )
) as Record<string, string>

const router = express.Router()

for (const [route, module] of Object.entries(LIB_ROUTES)) {
  try {
    router.use(
      route,
      (await import(path.resolve(process.cwd(), `src/core/lib/${module}`)))
        .default
    )
  } catch (error) {
    console.error(`Failed to load module for route ${route}: `, error)
  }
}

for (const [route, module] of Object.entries(MODULE_ROUTES)) {
  try {
    router.use(
      route,
      (await import(path.resolve(process.cwd(), `src/apps/${module}`))).default
    )
  } catch (error) {
    console.error(`Failed to load module for route ${route}:`, error)
  }
}

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

bulkRegisterControllers(router, [getMedia, getAllRoutes, corsAnywhere])

router.use((req, res) => {
  res.status(404)

  res.json({
    state: 'error',
    message: 'Endpoint not found'
  })
})

export default router
