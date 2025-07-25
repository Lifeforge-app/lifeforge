import { lazy } from 'react'

import type { ModuleConfig } from '../../routes/interfaces/routes_interfaces'

export default {
  name: 'Localization Manager',
  icon: 'mingcute:translate-line',
  routes: {
    'localization-manager': lazy(() => import('.'))
  },
  togglable: false,
  forceDisable: !import.meta.env.VITE_LOCALIZATION_MANAGER_URL
} satisfies ModuleConfig
