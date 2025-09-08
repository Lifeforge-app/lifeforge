import { lazy } from 'react'

import type { ModuleConfig } from '../../../core/routes/interfaces/routes_interfaces'

export default {
  name: 'Sin Chew Daily',
  icon: 'tabler:news',
  routes: {
    'sin-chew-daily': lazy(() => import('.'))
  },
  togglable: true
} satisfies ModuleConfig
