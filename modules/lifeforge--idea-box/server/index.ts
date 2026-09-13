import { forgeRouter, writeContractFileToClient } from '@lifeforge/server-utils'

import * as containersRoutes from './routes/containers'
import * as foldersRoutes from './routes/folders'
import * as ideasRoutes from './routes/ideas'
import * as miscRoutes from './routes/misc'
import * as tagsRoutes from './routes/tags'

const routes = forgeRouter({
  containers: containersRoutes,
  folders: foldersRoutes,
  ideas: ideasRoutes,
  tags: tagsRoutes,
  misc: miscRoutes
})

writeContractFileToClient(routes, import.meta.dirname)

export default routes
