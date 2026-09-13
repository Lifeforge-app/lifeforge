import { forgeRouter, writeContractFileToClient } from '@lifeforge/server-utils'

import * as entriesRoutes from './routes/entries'
import * as youtubeRoutes from './routes/youtube'

const routes = forgeRouter({
  entries: entriesRoutes,
  youtube: youtubeRoutes
})

writeContractFileToClient(routes, import.meta.dirname)

export default routes
