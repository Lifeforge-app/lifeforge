import forgeRouter from '@functions/forgeRouter'

import containersRouter from './controllers/containers'
import foldersRouter from './controllers/folders'
import ideasRouter from './controllers/ideas'
import miscRouter from './controllers/misc'
import tagsRouter from './controllers/tags'

export default forgeRouter({
  '/containers': containersRouter,
  '/folders': foldersRouter,
  '/ideas': ideasRouter,
  '/tags': tagsRouter,
  '/': miscRouter
})
