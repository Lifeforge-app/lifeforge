import { forgeController, forgeRouter } from '@functions/routes'
import { registerRoutes } from '@functions/routes/functions/forgeRouter'
import { clientError } from '@functions/routes/utils/response'
import traceRouteStack from '@functions/utils/traceRouteStack'
import express from 'express'

import appRoutes from './app.routes'
import coreRoutes from './core.routes'

const router = express.Router()

const listRoutes = forgeController
  .query()
  .description('Get all registered routes')
  .input({})
  .callback(async () => traceRouteStack(router.stack))

const mainRoutes = forgeRouter({
  ...appRoutes,
  ...coreRoutes,
  listRoutes
})

router.use('/', registerRoutes(mainRoutes))

router.get('*', (_, res) => {
  return clientError(res, 'The requested endpoint does not exist', 404)
})

export { mainRoutes }

export default router
