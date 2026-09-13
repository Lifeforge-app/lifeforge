import { forgeRouter, writeContractFileToClient } from '@lifeforge/server-utils'

import * as youtubeRoutes from './routes/youtube'

const routes = forgeRouter({ youtube: youtubeRoutes })

writeContractFileToClient(routes, import.meta.dirname)

export default routes
