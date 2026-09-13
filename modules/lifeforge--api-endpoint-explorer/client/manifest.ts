import { lazy } from 'react'

import { createForgeModule } from '@lifeforge/federation'

const { forgeAPI, ...manifest } = createForgeModule({
  routes: {
    '/': lazy(() => import('@'))
  }
})

export default manifest

export { forgeAPI }
