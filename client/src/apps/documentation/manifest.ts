import { lazy } from 'react'
import type { ModuleConfig } from 'shared'

export default {
  name: 'Documentation',
  icon: 'tabler:info-circle',
  routes: {
    documentation: lazy(() => import('.'))
  },
  togglable: false,
  category: '<END>'
} as ModuleConfig
