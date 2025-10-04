import { lazy } from 'react'
import type { ModuleConfig } from 'shared'

export default {
  name: 'Passwords',
  icon: 'tabler:key',
  routes: {
    passwords: lazy(() => import('@'))
  },
  togglable: true,
  category: '05.Confidential'
} satisfies ModuleConfig
