import express from 'express'

import wishlistEntriesRouter from './controllers/entries.controller'
import wishlistListsRouter from './controllers/lists.controller'

const router = express.Router()

router.use('/lists', wishlistListsRouter)
router.use('/entries', wishlistEntriesRouter)

export default router
