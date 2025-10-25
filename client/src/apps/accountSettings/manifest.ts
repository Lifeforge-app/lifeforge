import { lazy } from 'react'
import type { ModuleConfig } from 'shared'

export default {
  name: 'Account Settings',
  icon: 'tabler:user-cog',
  routes: {
    account: lazy(() => import('.'))
  },
  hidden: true,
  category: 'Settings'
} satisfies ModuleConfig
