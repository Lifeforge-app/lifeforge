import type { ModuleConfig } from '@core/routes/interfaces/routes_interfaces'
import { lazy } from 'react'

export default {
  name: 'Achievements',
  icon: 'tabler:award',
  routes: {
    achievements: lazy(() => import('.'))
  },
  togglable: true
} satisfies ModuleConfig
