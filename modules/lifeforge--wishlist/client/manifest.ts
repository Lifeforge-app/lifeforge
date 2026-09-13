import { lazy } from 'react'

import { createForgeModule } from '@lifeforge/federation'

import contract from './contract'

const { forgeAPI, ...manifest } = createForgeModule({
  routes: {
    '/': lazy(() => import('@/pages/WishlistList')),
    '/:id': lazy(() => import('@/pages/WishlistEntries'))
  },
  contract
})

export default manifest

export { forgeAPI }
