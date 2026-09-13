import { forgeRouter, writeContractFileToClient } from '@lifeforge/server-utils'

import * as sessionsRoutes from './routes/sessions'
import * as settingsRoutes from './routes/settings'

const routes = forgeRouter({
  settings: settingsRoutes,
  sessions: sessionsRoutes
})

writeContractFileToClient(routes, import.meta.dirname)

export default routes
