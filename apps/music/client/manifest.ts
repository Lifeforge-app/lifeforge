import { lazy } from 'react'
import type { ModuleConfig } from 'shared'

export default {
  name: 'Music',
  icon: 'tabler:music',
  routes: {
    music: lazy(() => import('@'))
  },
  category: '04.Storage'
} satisfies ModuleConfig
