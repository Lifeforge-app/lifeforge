import { lazy } from 'react'

import { createForgeModule } from '@lifeforge/federation'

import contract from './contract'

const { forgeAPI, ...manifest } = createForgeModule({
  routes: {
    '/': lazy(() => import('@/index')),
    '/compose': lazy(() => import('@/pages/Compose'))
  },
  contract
})

export default manifest

export { forgeAPI }
