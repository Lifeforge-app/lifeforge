import { createForgeProxy } from '@lifeforge/shared'

import type { CoreRoutes } from '../../server/src/core/routes/core-routes.types'

const forgeAPI = createForgeProxy<CoreRoutes>(
  import.meta.env.VITE_API_HOST || 'https://localhost:3000'
)

export default forgeAPI
