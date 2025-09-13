import type { ModuleConfig } from '@core/routes/interfaces/routes_interfaces'
import { lazy } from 'react'

export default {
  name: 'Music',
  icon: 'tabler:music',
  routes: {
    music: lazy(() => import('.'))
  },
  togglable: true
} satisfies ModuleConfig
