import { lazy } from 'react'
import type { ModuleConfig } from 'shared'

export default {
  name: 'Achievements',
  icon: 'tabler:award',
  routes: {
    achievements: lazy(() => import('@'))
  },

  category: '02.Lifestyle'
} satisfies ModuleConfig
