import { lazy } from 'react'

export default {
  name: 'Blog',
  icon: 'tabler:pencil-heart',
  routes: {
    blog: lazy(() => import('@')),
    'blog/compose': lazy(() => import('@/pages/Compose'))
  },
  category: '02.Lifestyle'
}
