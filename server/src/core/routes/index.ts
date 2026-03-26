import { ROOT_DIR } from '@constants'
import { forgeRouter } from '@lifeforge/server-utils'
import express from 'express'
import path from 'path'

import traceRouteStack from '@functions/initialization/traceRouteStack'
import { loadModuleRoutes } from '@functions/modules/loadModuleRoutes'
import { registerRoutes } from '@functions/routes/functions/forgeRouter'
import { clientError } from '@functions/routes/utils/response'

import { CORS_ALLOWED_ORIGINS } from './constants/corsAllowedOrigins'
import coreRoutes from './core.routes'
import forge from './forge'

const router = express.Router()

// Load module routes: production uses FS scanning, dev uses generated registry
// Type assertion ensures TypeScript uses generated types for inference
const appRoutes = await loadModuleRoutes()

const listRoutes = forge
  .query()
  .description('List all available API routes')
  .input({})
  .callback(async () => traceRouteStack(router.stack))

const mainRoutes = forgeRouter({
  ...appRoutes,
  ...coreRoutes,
  listRoutes
})

router.get('/hello', (_, res) => {
  res.send('Hello from the API server!')
})

router.use('/modules/:moduleName/*', (req, res, next) => {
  const moduleName = req.params.moduleName

  const filePath =
    (req.params[0 as unknown as keyof typeof req.params] as string) || ''

  // Sanitize filePath to prevent path traversal
  const sanitizedPath = path.normalize(filePath).replace(/^(\.\.[\/\\])+/, '')

  // Use dist-docker in Docker mode, dist otherwise
  const distDir = process.env.DOCKER_MODE === 'true' ? 'dist-docker' : 'dist'

  const moduleDistPath = path.join(
    ROOT_DIR,
    'apps',
    moduleName,
    'client',
    distDir
  )

  const resolvedPath = path.join(moduleDistPath, sanitizedPath)

  // Security: Prevent path traversal - ensure resolved path stays within module directory
  if (!resolvedPath.startsWith(moduleDistPath)) {
    return res.status(403).send('Access denied')
  }

  // Security: Use configured CORS origins instead of wildcard
  const origin = req.headers.origin
  if (origin && CORS_ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin)
  }
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin')

  res.sendFile(resolvedPath, err => {
    if (!err) return

    const fallbackPath = path.join(moduleDistPath, 'index.html')

    if (fallbackPath === resolvedPath) {
      next()

      return
    }

    res.sendFile(fallbackPath, fallbackErr => {
      if (fallbackErr) {
        next()
      }
    })
  })
})

router.use('/', registerRoutes(mainRoutes))

router.get('*', (_, res) => {
  return clientError({
    res,
    message: 'The requested endpoint does not exist',
    code: 404,
    moduleName: 'core'
  })
})

export { mainRoutes }

export default router
