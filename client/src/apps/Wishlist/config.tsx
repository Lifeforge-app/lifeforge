import { lazy } from 'react'

import { ModuleConfig } from '../../core/routes/interfaces/routes_interfaces'

export default {
  name: 'Wishlist',
  icon: 'tabler:heart',
  routes: {
    wishlist: lazy(() => import('./pages/WishlistList')),
    wishlist: lazy(() => import('./pages/WishlistEntries'))
  },
  togglable: true,
  hasAI: true
} satisfies ModuleConfig
