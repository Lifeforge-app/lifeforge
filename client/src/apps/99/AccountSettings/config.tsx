import type { ModuleConfig } from '@core/routes/interfaces/routes_interfaces'
import { lazy } from 'react'

export default {
  name: 'Account Settings',
  icon: 'tabler:user-cog',
  routes: {
    account: lazy(() => import('.'))
  },
  togglable: false,
  hidden: true
} satisfies ModuleConfig
