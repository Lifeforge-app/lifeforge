import { lazy } from 'react'

import type { ModuleConfig } from '../../../core/routes/interfaces/routes_interfaces'

export default {
  name: 'Changi Airport Flight Status',
  icon: 'tabler:plane',
  routes: {
    'changi-airport-flight-status': lazy(() => import('.'))
  },
  togglable: true
} satisfies ModuleConfig
