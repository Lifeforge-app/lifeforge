import { lazy } from 'react'
import type { ModuleConfig } from 'shared'

export default {
  name: 'Idea Box',
  icon: 'tabler:bulb',
  routes: {
    'idea-box': lazy(() => import('@/pages/Containers')),
    'idea-box/:id/*': lazy(() => import('@/pages/Ideas'))
  },
  category: '01.Productivity'
} satisfies ModuleConfig
