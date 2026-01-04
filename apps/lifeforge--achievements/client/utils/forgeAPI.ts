import { type AppRoutes } from '@server/core/routes/routes.type'
import { createForgeAPIClient } from 'shared'

if (!import.meta.env.VITE_API_HOST) {
  throw new Error('VITE_API_HOST is not defined')
}

const forgeAPI = createForgeAPIClient<AppRoutes>(import.meta.env.VITE_API_HOST)

export default forgeAPI
