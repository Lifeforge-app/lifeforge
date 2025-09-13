import type { ModuleConfig } from '@core/routes/interfaces/routes_interfaces'
import { lazy } from 'react'

export default {
  name: 'API Keys',
  icon: 'tabler:password',
  routes: {
    'api-keys': lazy(() => import('.'))
  },
  togglable: false
} satisfies ModuleConfig
