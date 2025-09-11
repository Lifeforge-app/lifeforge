import { forgeController, forgeRouter } from '@functions/routes'
import { registerRoutes } from '@functions/routes/functions/forgeRouter'
import { clientError } from '@functions/routes/utils/response'
import traceRouteStack from '@functions/utils/traceRouteStack'
import express from 'express'

import { createAIRouter } from '../../lib/ai'
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

// Split the router to prevent circular dependency issues
const aiRoutes = createAIRouter(mainRoutes)

const allRoutes = forgeRouter({
  ...mainRoutes,
  ai: aiRoutes
})

router.use('/', registerRoutes(allRoutes))

router.get('*', (_, res) => {
  return clientError(res, 'The requested endpoint does not exist', 404)
})

export { allRoutes }

export default router
