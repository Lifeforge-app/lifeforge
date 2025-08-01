import { createForgeAPIClient } from 'shared'

import { type AppRoutes } from '../../../../server/src/core/routes/routes.type'

const forgeAPI = createForgeAPIClient<AppRoutes>(
  import.meta.env.VITE_API_HOST || 'https://localhost:3000'
)

export default forgeAPI
