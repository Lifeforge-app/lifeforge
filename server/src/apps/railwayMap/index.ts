import express from 'express'

import railwayMapRouter from './controllers/railwayMap.controller'

const router = express.Router()

router.use('/', railwayMapRouter)

export default router
