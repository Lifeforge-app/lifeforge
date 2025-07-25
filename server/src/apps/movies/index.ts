import express from 'express'

import moviesEntriesRouter from './controllers/entries.controller'
import moviesTicketRouter from './controllers/ticket.controller'
import moviesTMDBRouter from './controllers/tmdb.controller'

const router = express.Router()

router.use('/entries', moviesEntriesRouter)
router.use('/ticket', moviesTicketRouter)
router.use('/tmdb', moviesTMDBRouter)

export default router
