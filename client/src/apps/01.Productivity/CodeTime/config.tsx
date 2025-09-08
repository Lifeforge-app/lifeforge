import type { ModuleConfig } from '@core/routes/interfaces/routes_interfaces'
import { lazy } from 'react'

export default {
  name: 'Code Time',
  icon: 'tabler:code',
  routes: {
    'code-time': lazy(() => import('.'))
  },
  togglable: true
} satisfies ModuleConfig
