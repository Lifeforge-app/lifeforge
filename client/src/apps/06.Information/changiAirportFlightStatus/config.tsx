import { lazy } from 'react'
import type { ModuleConfig } from 'shared'

export default {
  name: 'Changi Airport Flight Status',
  icon: 'tabler:plane',
  routes: {
    'changi-airport-flight-status': lazy(() => import('.'))
  },
  togglable: true
} satisfies ModuleConfig
