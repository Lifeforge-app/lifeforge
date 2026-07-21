import { ROOT_DIR } from '@constants'
import { loadAndRegisterModuleRoutes } from '@functions/modules/loadModuleRoutes'
import { registerRoutes } from '@functions/routes/functions/forgeRouter'
import { clientError } from '@functions/routes/utils/response'
import express from 'express'
import path from 'path'

import { forgeRouter } from '@lifeforge/server-utils'

import coreRoutes from './core.routes'

const router = express.Router()

const appRoutes = await loadAndRegisterModuleRoutes()

const mainRoutes = forgeRouter({
  ...coreRoutes,
  modules: forgeRouter({
    ...coreRoutes.modules,
    ...appRoutes
  })
})

router.use('/modules/:moduleName/*', (req, res, next) => {
  const moduleName = req.params.moduleName

  // Strict whitelist check for moduleName to prevent traversal, spaces, or special characters
  const MODULE_NAME_REGEX = /^[A-Za-z0-9][A-Za-z0-9_-]*$/

  if (!MODULE_NAME_REGEX.test(moduleName)) {
    return next()
  }

  const filePath =
    (req.params[0 as any as keyof typeof req.params] as string) || ''

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
    if (err) {
      next()
    }
  })
})

router.use('/', registerRoutes(mainRoutes))

router.get('*', (_, res) => {
  res.set('Cache-Control', 'no-store')

  return clientError({
    res,
    message: 'The requested endpoint does not exist',
    code: 404,
    moduleName: 'core'
  })
})

export { mainRoutes }

export default router
