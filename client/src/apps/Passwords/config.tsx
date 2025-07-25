import { lazy } from 'react'

import type { ModuleConfig } from '../../core/routes/interfaces/routes_interfaces'

export default {
  name: 'Passwords',
  icon: 'tabler:key',
  provider: lazy(() => import('./providers/PasswordsProvider')),
  routes: {
    '': lazy(() => import('.'))
  },
  togglable: true
} satisfies ModuleConfig
