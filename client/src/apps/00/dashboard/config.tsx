import type { ModuleConfig } from '@core/routes/interfaces/routes_interfaces'
import { lazy } from 'react'

export default {
  name: 'Dashboard',
  icon: 'tabler:dashboard',
  routes: {
    dashboard: lazy(() => import('.'))
  },
  togglable: false
} satisfies ModuleConfig
