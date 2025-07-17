import { lazy } from 'react'

import { ModuleConfig } from '../../core/routes/interfaces/routes_interfaces'

export default {
  name: 'Music',
  icon: 'tabler:music',
  routes: {
    music: lazy(() => import('.'))
  },
  togglable: true
} satisfies ModuleConfig
