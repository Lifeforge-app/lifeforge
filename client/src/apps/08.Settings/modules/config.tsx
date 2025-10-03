import { lazy } from 'react'
import type { ModuleConfig } from 'shared'

export default {
  name: 'Modules',
  icon: 'tabler:plug',
  routes: {
    modules: lazy(() => import('.'))
  },
  togglable: false
} satisfies ModuleConfig
