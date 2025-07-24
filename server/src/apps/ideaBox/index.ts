import { forgeRouter } from '@functions/routes'

import containersRouter from './routes/containers'
import foldersRouter from './routes/folders'
import ideasRouter from './routes/ideas'
import miscRouter from './routes/misc'
import tagsRouter from './routes/tags'

export default forgeRouter({
  containers: containersRouter,
  folders: foldersRouter,
  ideas: ideasRouter,
  tags: tagsRouter,
  misc: miscRouter
})
