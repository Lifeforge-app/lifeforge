import { lazy } from 'react'
import type { ModuleConfig } from 'shared'

export default {
  name: 'Personalization',
  icon: 'tabler:palette',
  routes: {
    '/': lazy(() => import('.'))
  },
  category: 'Settings'
} satisfies ModuleConfig
