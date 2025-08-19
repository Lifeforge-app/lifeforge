import { lazy } from 'react'

import type { ModuleConfig } from '../../core/routes/interfaces/routes_interfaces'

export default {
  name: 'Moment Vault',
  icon: 'tabler:history',
  hasAI: true,
  routes: {
    'moment-vault': lazy(() => import('.'))
  },
  togglable: true,
  requiredAPIKeys: ['openaffi']
} satisfies ModuleConfig
