import { type AppRoutes } from '@server/core/routes/routes.type'
import { createForgeAPIClient } from 'shared'

const forgeAPI = createForgeAPIClient<AppRoutes>(
  import.meta.env.VITE_API_HOST || 'https://localhost:3000'
)

export default forgeAPI
