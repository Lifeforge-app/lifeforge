import { type Router } from '@server/core/routes'
import { createForgeAPIClient } from 'lifeforge-api'

const forgeAPI = createForgeAPIClient<Router>(
  import.meta.env.VITE_API_HOST || 'https://localhost:3000'
)

export default forgeAPI
