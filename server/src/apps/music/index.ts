import express from 'express'

import musicEntriesRouter from './controllers/entries.controller'
import musicYoutubeRouter from './controllers/youtube.controller'

const router = express.Router()

router.use('/entries', musicEntriesRouter)
router.use('/youtube', musicYoutubeRouter)

export default router
