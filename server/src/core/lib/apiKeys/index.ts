import express from 'express'

import apiKeysAuthRouter from './controllers/auth.controller'
import apiKeysEntriesRouter from './controllers/entries.controller'

const router = express.Router()

router.use('/auth', apiKeysAuthRouter)
router.use('/entries', apiKeysEntriesRouter)

export default router
