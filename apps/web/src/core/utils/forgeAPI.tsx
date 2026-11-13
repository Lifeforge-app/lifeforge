import {
  type CoreContract,
  configureForge,
  createForgeProxy
} from '@lifeforge/api'

configureForge({
  apiHost: import.meta.env.VITE_API_HOST || 'https://localhost:3000'
})

const forgeAPI = createForgeProxy<CoreContract>()

export default forgeAPI
