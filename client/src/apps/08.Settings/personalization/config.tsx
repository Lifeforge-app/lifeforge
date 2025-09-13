import type { ModuleConfig } from '@core/routes/interfaces/routes_interfaces'
import { lazy } from 'react'

export default {
  name: 'Personalization',
  icon: 'tabler:palette',
  routes: {
    personalization: lazy(() => import('.'))
  },
  togglable: false
} satisfies ModuleConfig
