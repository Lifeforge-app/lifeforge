import { type AppRoutes } from '@server/core/routes/routes.type'
import { createForgeProxy } from 'shared'

const forgeAPI = createForgeProxy<AppRoutes>(
  import.meta.env.VITE_API_HOST || 'https://localhost:3000'
)

export default forgeAPI
