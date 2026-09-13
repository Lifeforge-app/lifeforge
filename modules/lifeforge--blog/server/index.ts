import { forgeRouter, writeContractFileToClient } from '@lifeforge/server-utils'

import * as entriesRoutes from './routes/entries'

const routes = forgeRouter({
  entries: entriesRoutes
})

writeContractFileToClient(routes, import.meta.dirname)

export default routes
