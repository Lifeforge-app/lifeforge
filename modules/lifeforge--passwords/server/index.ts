import { forgeRouter, writeContractFileToClient } from '@lifeforge/server-utils'

import * as categoriesRoutes from './routes/categories'
import * as entriesRoutes from './routes/entries'
import * as masterRoutes from './routes/master'
import * as recoveryRoutes from './routes/recovery'

const routes = forgeRouter({
  master: masterRoutes,
  entries: entriesRoutes,
  categories: categoriesRoutes,
  recovery: recoveryRoutes
})

writeContractFileToClient(routes, import.meta.dirname)

export default routes
