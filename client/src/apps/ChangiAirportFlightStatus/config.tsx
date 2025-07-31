import { IconPlane } from '@tabler/icons-react'
import { lazy } from 'react'

import type { ModuleConfig } from '../../core/routes/interfaces/routes_interfaces'

export default {
  name: 'Changi Airport Flight Status',
  icon: <IconPlane />,
  routes: {
    calendar: lazy(() => import('.'))
  },
  togglable: true
} satisfies ModuleConfig
