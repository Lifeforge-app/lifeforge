import { registerRoutes } from '@functions/routes/functions/forgeRouter'
import express from 'express'

import appRoutes from './app.routes'

const router = express.Router()

router.get('/', (req, res) => {
  res.json({
    message: 'Welcome to LifeForge API!'
  })
})

// const listRoutes = forgeController.query
//   .description('Get all registered routes')
//   .input({})
//   .callback(async () => traceRouteStack(router.stack))

router.use('/', registerRoutes(appRoutes))

export default router
