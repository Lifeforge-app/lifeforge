import { lazy } from 'react'
import type { ModuleConfig } from 'shared'

export default {
  name: 'Dashboard',
  icon: 'tabler:dashboard',
  routes: {
    dashboard: lazy(() => import('.'))
  },
  togglable: false
} satisfies ModuleConfig
