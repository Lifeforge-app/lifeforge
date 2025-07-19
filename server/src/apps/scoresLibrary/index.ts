import express from 'express'

import scoresLibraryEntriesRouter from './controllers/entries.controller'
import scoresLibraryGuitarWorldRouter from './controllers/guitarWorld.controller'
import scoresLibraryTypesRouter from './controllers/types.controller'

const router = express.Router()

router.use('/entries', scoresLibraryEntriesRouter)
router.use('/guitar-world', scoresLibraryGuitarWorldRouter)
router.use('/types', scoresLibraryTypesRouter)

export default router
