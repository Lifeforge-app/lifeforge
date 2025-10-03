import { lazy } from 'react'
import type { ModuleConfig } from 'shared'

export default {
  name: 'Personalization',
  icon: 'tabler:palette',
  routes: {
    personalization: lazy(() => import('.'))
  },
  togglable: false
} satisfies ModuleConfig
