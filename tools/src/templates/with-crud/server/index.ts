import { forgeRouter } from '@lifeforge/server-utils'
import { createForge } from '@lifeforge/server-utils'

import * as entriesRoutes from './routes/entries'

const forge = createForge(schema)

export default forgeRouter({
  entries: entriesRoutes
})
