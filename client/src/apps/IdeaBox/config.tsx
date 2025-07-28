import { IconBulb } from '@tabler/icons-react'
import { lazy } from 'react'

import type { ModuleConfig } from '../../core/routes/interfaces/routes_interfaces'

export default {
  name: 'Idea Box',
  icon: <IconBulb />,
  routes: {
    'idea-box': lazy(() => import('./pages/Containers')),
    'idea-box/:id/*': lazy(() => import('./pages/Ideas'))
  },
  togglable: true
} satisfies ModuleConfig
