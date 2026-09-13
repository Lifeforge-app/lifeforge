import { forgeRouter, writeContractFileToClient } from '@lifeforge/server-utils'

import * as entriesRoutes from './routes/entries'
import * as transcriptionRoutes from './routes/transcription'

const routes = forgeRouter({
  entries: entriesRoutes,
  transcribe: transcriptionRoutes
})

writeContractFileToClient(routes, import.meta.dirname)

export default routes
