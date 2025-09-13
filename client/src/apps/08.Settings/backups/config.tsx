import type { ModuleConfig } from '@core/routes/interfaces/routes_interfaces'
import { lazy } from 'react'

export default {
  name: 'Backups',
  icon: 'tabler:history',
  routes: {
    backups: lazy(() => import('.'))
  },
  togglable: false
} satisfies ModuleConfig
