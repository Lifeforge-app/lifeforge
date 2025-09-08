import { lazy } from 'react'

import type { ModuleConfig } from '../../../core/routes/interfaces/routes_interfaces'

export default {
  name: 'Railway Map',
  icon: 'uil:subway',
  provider: lazy(() => import('./providers/RailwayMapProvider')),
  routes: {
    '': lazy(() => import('.'))
  },
  togglable: true
} satisfies ModuleConfig
