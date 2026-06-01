import { createForgeProxy } from '@lifeforge/shared'

import contract from './contract'

const forgeAPI = createForgeProxy(
  contract,
  import.meta.env.VITE_API_HOST || 'https://localhost:3000'
)

export default forgeAPI
