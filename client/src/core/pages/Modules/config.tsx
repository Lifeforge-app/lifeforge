import type { ModuleConfig } from '@core/routes/interfaces/routes_interfaces'
import { lazy } from 'react'

export default {
  name: 'Modules',
  icon: 'tabler:plug',
  routes: {
    modules: lazy(() => import('.'))
  },
  togglable: false
} satisfies ModuleConfig
