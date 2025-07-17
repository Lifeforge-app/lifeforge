import { lazy } from 'react'

import { ModuleConfig } from '../../routes/interfaces/routes_interfaces'

export default {
  name: 'Localization Manager',
  icon: 'mingcute:translate-line',
  routes: {
    'localization-manager': lazy(() => import('.'))
  },
  togglable: false
} satisfies ModuleConfig
