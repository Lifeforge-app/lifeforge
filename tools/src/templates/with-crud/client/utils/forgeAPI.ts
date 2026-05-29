import routes from '@server/index'

import { createForgeProxy } from '@lifeforge/shared'

if (!import.meta.env.VITE_API_HOST) {
  throw new Error('VITE_API_HOST is not defined')
}

const forgeAPI = createForgeProxy<typeof routes>(import.meta.env.VITE_API_HOST)

export default forgeAPI
