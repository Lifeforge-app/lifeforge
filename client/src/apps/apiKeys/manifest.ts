import { lazy } from 'react'
import type { ModuleConfig } from 'shared'

export default {
  name: 'API Keys',
  icon: 'tabler:password',
  routes: {
    '/': lazy(() => import('.'))
  },
  category: 'Settings'
} satisfies ModuleConfig
