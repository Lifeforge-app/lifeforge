import { lazy } from 'react'
import type { ModuleConfig } from 'shared'

export default {
  name: 'Music',
  icon: 'tabler:music',
  routes: {
    music: lazy(() => import('.'))
  },
  togglable: true
} satisfies ModuleConfig
