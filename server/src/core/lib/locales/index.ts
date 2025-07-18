import express from 'express'

import localesRouter from './controllers/locales.controller'
import localesManagerRouter from './controllers/localesManager.controller'

const router = express.Router()

router.use('/manager', localesManagerRouter)
router.use('/', localesRouter)

export default router
