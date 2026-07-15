import { createForgeProxy } from '@lifeforge/api'

import { contract } from '@/contract'

export const forgeAPI = createForgeProxy(contract)
