import express from 'express'

import codeTimeRouter from './controllers/codeTime.controller'

const router = express.Router()

router.use('/', codeTimeRouter)

export default router
