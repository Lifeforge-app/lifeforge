import { lazy } from 'react'

import { createForgeModule } from '@lifeforge/federation'

import contract from './contract'

const { forgeAPI, ...manifest } = createForgeModule({
  routes: {
    '/': lazy(() => import('@/pages/Containers')),
    '/:id/*': lazy(() => import('@/pages/Ideas'))
  },
  contract
})

export default manifest

export { forgeAPI }
