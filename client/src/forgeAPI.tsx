import { createForgeProxy, globalProxyRegistry } from '@lifeforge/shared'

import contract from '../contract'

globalProxyRegistry.set(contract, {
  moduleId: '',
  apiHost: import.meta.env.VITE_API_HOST || 'https://localhost:3000'
})

const forgeAPI = createForgeProxy(contract)

export default forgeAPI
