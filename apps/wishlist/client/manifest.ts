import { lazy } from 'react'
import type { ModuleConfig } from 'shared'

export default {
  name: 'Wishlist',
  icon: 'tabler:heart',
  routes: {
    wishlist: lazy(() => import('@/pages/WishlistList')),
    'wishlist/:id': lazy(() => import('@/pages/WishlistEntries'))
  },
  hasAI: true,
  category: '03.Finance'
} satisfies ModuleConfig
