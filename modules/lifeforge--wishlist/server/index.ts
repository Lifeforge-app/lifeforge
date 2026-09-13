import { forgeRouter, writeContractFileToClient } from '@lifeforge/server-utils'

import * as entriesRoutes from './routes/entries'
import * as listsRoutes from './routes/lists'

const routes = forgeRouter({
  lists: listsRoutes,
  entries: entriesRoutes
})

writeContractFileToClient(routes, import.meta.dirname)

export default routes
