import type { Router } from '@server/core/routes'
import { ForgeAPIClient } from 'lifeforge-api'

const forgeAPI = new ForgeAPIClient<Router>(
  import.meta.env.VITE_API_HOST || 'https://localhost:3000'
)

export default forgeAPI
