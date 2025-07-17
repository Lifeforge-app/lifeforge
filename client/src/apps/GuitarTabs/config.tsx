import { lazy } from 'react'

import { ModuleConfig } from '../../core/routes/interfaces/routes_interfaces'

export default {
  name: 'Guitar Tabs',
  icon: 'mingcute:guitar-line',
  routes: {
    'guitar-tabs': lazy(() => import('.'))
  },
  togglable: true
} satisfies ModuleConfig
