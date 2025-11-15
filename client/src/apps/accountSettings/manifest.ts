import { lazy } from 'react'
import type { ModuleConfig } from 'shared'

export default {
  name: 'Account Settings',
  icon: 'tabler:user-cog',
  routes: {
    '/': lazy(() => import('.'))
  },
  hidden: true,
  category: 'Settings'
} satisfies ModuleConfig
