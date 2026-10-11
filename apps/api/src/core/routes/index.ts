import { ROOT_DIR } from '@constants'
import { registerRoutes } from '@functions/routes/functions/forgeRouter'
import { clientError } from '@functions/routes/utils/response'
import express from 'express'
import path from 'path'

import { createModuleRuntime } from '@lifeforge/module-runtime/loader'
import { forgeRouter } from '@lifeforge/server-utils'

import { initDrizzle } from '../drizzle'
import coreRoutes from './core.routes'

const IS_PRODUCTION = process.env.NODE_ENV === 'production'

const router = express.Router()

// Serve module client bundles before the module API routes.
router.use('/modules/:moduleName/*', (req, res, next) => {
  const moduleName = req.params.moduleName

  // Strict whitelist check for moduleName to prevent traversal, spaces, or special characters
  const MODULE_NAME_REGEX = /^[A-Za-z0-9][A-Za-z0-9_-]*$/

  if (!MODULE_NAME_REGEX.test(moduleName)) {
    return next()
  }

  const filePath = req.params[0 as any as keyof typeof req.params] || ''

  // Block null byte injection in filePath
  if (filePath.includes('\0')) {
    return next()
  }

  const moduleDistPath = path.resolve(
    ROOT_DIR,
    'modules',
    moduleName,
    'client',
    'dist'
  )

  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin')

  // Serve file securely using the root sandbox parameter
  res.sendFile(filePath, { root: moduleDistPath }, err => {
    // Only fall through when the file could not be sent. Calling next() after a
    // successful response (or a client abort mid-stream) would let later
    // handlers respond again and raise ERR_HTTP_HEADERS_SENT.
    if (err && !res.headersSent) {
      next()
    }
  })
})

const moduleRuntime = createModuleRuntime({
  modulesDir: path.join(ROOT_DIR, 'modules'),
  isProduction: IS_PRODUCTION,
  outerRouter: router,
  buildRouter: appRoutes => {
    initDrizzle()

    return registerRoutes(
      forgeRouter({
        ...coreRoutes,
        modules: forgeRouter({
          ...coreRoutes.modules,
          ...appRoutes
        })
      })
    )
  }
})

// Initial module load + drizzle init.
await moduleRuntime.reload()

router.get('*', (_, res) => {
  res.set('Cache-Control', 'no-store')

  return clientError({
    res,
    message: 'The requested endpoint does not exist',
    code: 404,
    moduleName: 'core'
  })
})

/** Starts watching the modules directory and reloading on changes. */
export function startModuleWatcher(): void {
  moduleRuntime.watch()
}

export default router
