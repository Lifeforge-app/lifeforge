import { forgeRouter } from '@functions/routes'

import clientsRoutes from './routes/clients'
import invoicesRoutes from './routes/invoices'
import itemsRoutes from './routes/items'
import settingsRoutes from './routes/settings'

export default forgeRouter({
  invoices: invoicesRoutes,
  items: itemsRoutes,
  clients: clientsRoutes,
  settings: settingsRoutes
})
