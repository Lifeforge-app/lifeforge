import { createForgeProxy } from 'shared'

const forgeAPI = createForgeProxy(
  import.meta.env.VITE_API_HOST || 'https://localhost:3000'
)

export default forgeAPI
