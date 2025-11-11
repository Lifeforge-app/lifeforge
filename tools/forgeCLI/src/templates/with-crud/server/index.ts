import { forgeRouter } from '@functions/routes'

import * as entriesRoutes from './routes/entries'

export default forgeRouter({
  entries: entriesRoutes
})
