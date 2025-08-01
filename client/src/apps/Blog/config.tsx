import { IconPencilHeart } from '@tabler/icons-react'
import { lazy } from 'react'

export default {
  name: 'Blog',
  icon: <IconPencilHeart />,
  routes: {
    blog: lazy(() => import('.')),
    'blog/compose': lazy(() => import('./pages/Compose'))
  },
  togglable: true
}
