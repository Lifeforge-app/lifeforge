import { IconBulb } from '@tabler/icons-react'
import { lazy } from 'react'

import { ModuleConfig } from '../../core/routes/interfaces/routes_interfaces'

export default {
  name: 'Idea Box',
  provider: lazy(() => import('./providers/IdeaBoxProvider')),
  icon: <IconBulb />,
  routes: {
    '': lazy(() => import('./pages/Containers')),
    ':id/*': lazy(() => import('./pages/Ideas'))
  },
  togglable: true
} satisfies ModuleConfig
