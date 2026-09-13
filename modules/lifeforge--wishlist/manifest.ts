import { lazy } from 'react'

export default {
  name: 'Wishlist',
  icon: 'tabler:heart',
  routes: {
    '/': lazy(() => import('@/pages/WishlistList')),
    '/:id': lazy(() => import('@/pages/WishlistEntries'))
  },
  hasAI: true,
  category: 'Finance'
}
