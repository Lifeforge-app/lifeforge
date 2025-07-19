import express from 'express'

import scoresLibraryEntriesRouter from './controllers/entries.controller'
import scoresLibraryGuitarWorldRouter from './controllers/guitarWorld.controller'

const router = express.Router()

router.use('/entries', scoresLibraryEntriesRouter)
router.use('/guitar-world', scoresLibraryGuitarWorldRouter)

export default router
