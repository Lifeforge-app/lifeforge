import { forgeRouter, writeContractFileToClient } from '@lifeforge/server-utils'

import * as annasRoutes from './routes/annas'
import * as collectionsRoutes from './routes/collection'
import * as entriesRoutes from './routes/entries'
import * as fileTypesRoutes from './routes/fileTypes'
import * as languagesRoutes from './routes/languages'
import * as readStatusRoutes from './routes/readStatus'

const routes = forgeRouter({
  entries: entriesRoutes,
  collections: collectionsRoutes,
  languages: languagesRoutes,
  fileTypes: fileTypesRoutes,
  readStatus: readStatusRoutes,
  annas: annasRoutes
})

writeContractFileToClient(routes, import.meta.dirname)

export default routes
