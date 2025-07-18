import express from 'express'

import blogEntriesRouter from './controllers/entries.contorller'

const router = express.Router()

router.use('/entries', blogEntriesRouter)

export default router
