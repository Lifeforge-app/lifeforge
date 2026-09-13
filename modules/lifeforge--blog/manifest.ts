import { lazy } from 'react'

export default {
  name: 'Blog',
  icon: 'tabler:pencil-heart',
  routes: {
    '/': lazy(() => import('@')),
    '/compose': lazy(() => import('@/pages/Compose'))
  },
  category: 'Lifestyle'
}
