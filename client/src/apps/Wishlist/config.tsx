import { lazy } from 'react'

import type { ModuleConfig } from '../../core/routes/interfaces/routes_interfaces'

export default {
  name: 'Wishlist',
  icon: 'tabler:heart',
  routes: {
    wishlist: lazy(() => import('./pages/WishlistList')),
    'wishlist/:id': lazy(() => import('./pages/WishlistEntries'))
  },
  togglable: true,
  hasAI: true
} satisfies ModuleConfig
