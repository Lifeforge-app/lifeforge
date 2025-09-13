import { lazy } from 'react'

import type { ModuleConfig } from '../../../core/routes/interfaces/routes_interfaces'

export default {
  name: 'Calendar',
  icon: 'tabler:calendar',
  routes: {
    calendar: lazy(() => import('.'))
  },
  togglable: true
} satisfies ModuleConfig
