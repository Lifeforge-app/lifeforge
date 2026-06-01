import { createForgeProxy } from '@lifeforge/shared'

import contract from '@/contract'

export const forgeAPI = createForgeProxy(contract)
