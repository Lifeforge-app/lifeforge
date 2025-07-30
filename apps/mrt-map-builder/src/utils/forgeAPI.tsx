import { createForgeAPIClient } from 'lifeforge-api'

import { type AppRoutes } from '../../../../server/src/core/appRoutes.type'

const forgeAPI = createForgeAPIClient<AppRoutes>(
  import.meta.env.VITE_API_HOST || 'https://localhost:3000'
)

export default forgeAPI
