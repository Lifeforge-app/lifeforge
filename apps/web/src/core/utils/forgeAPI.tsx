import { contract, createForgeProxy, globalProxyRegistry } from '@lifeforge/api'

globalProxyRegistry.set(contract, {
  moduleId: '',
  apiHost: import.meta.env.VITE_API_HOST || 'https://localhost:3000'
})

const forgeAPI = createForgeProxy(contract)

export default forgeAPI
