import { type CoreContract, createForgeProxy } from '@lifeforge/api'

export const forgeAPI = createForgeProxy<CoreContract>()
