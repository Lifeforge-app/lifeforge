import { ROOT_DIR } from '@constants'
import express from 'express'
import path from 'path'

import traceRouteStack from '@functions/initialization/traceRouteStack'
import { loadModuleRoutes } from '@functions/modules/loadModuleRoutes'
import { forgeController, forgeRouter } from '@functions/routes'
import { registerRoutes } from '@functions/routes/functions/forgeRouter'
import { clientError } from '@functions/routes/utils/response'

import type generatedRoutes from '../../generated/routes'
import coreRoutes from './core.routes'

const router = express.Router()

// Load module routes: production uses FS scanning, dev uses generated registry
// Type assertion ensures TypeScript uses generated types for inference
const appRoutes = (
  process.env.NODE_ENV === 'production'
    ? await loadModuleRoutes()
    : (await import('../../generated/routes')).default
) as typeof generatedRoutes

const listRoutes = forgeController
  .query()
  .description({
    en: 'List all available API routes',
    ms: 'Senaraikan semua laluan API yang tersedia',
    'zh-CN': '列出所有可用的API路由',
    'zh-TW': '列出所有可用的API路由'
  })
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
    (req.params[0 as any as keyof typeof req.params] as string) || ''

  const moduleDistPath = path.join(
    ROOT_DIR,
    'apps',
    moduleName,
    'client',
    'dist'
  )

  const resolvedPath = path.join(moduleDistPath, filePath)

  res.setHeader('Access-Control-Allow-Origin', '*')
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
