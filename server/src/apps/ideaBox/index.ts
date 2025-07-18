import express from 'express'

import ideaBoxContainersRouter from './controllers/containers.controller'
import ideaBoxFoldersRouter from './controllers/folders.controller'
import ideaBoxIdeasRouter from './controllers/ideas.controller'
import ideaBoxMiscRouter from './controllers/misc.controller'
import ideaBoxTagsRouter from './controllers/tags.controller'

const router = express.Router()

router.use('/containers', ideaBoxContainersRouter)
router.use('/folders', ideaBoxFoldersRouter)
router.use('/ideas', ideaBoxIdeasRouter)
router.use('/tags', ideaBoxTagsRouter)
router.use('/', ideaBoxMiscRouter)

export default router
