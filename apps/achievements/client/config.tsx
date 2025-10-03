import type { ModuleConfig } from '@client/core/routes/interfaces/routes_interfaces'
import { lazy } from 'react'

export default {
  name: 'Achievements',
  icon: 'tabler:award',
  routes: {
    achievements: lazy(() => import('.'))
  },
  togglable: true,
  category: '02.Lifestyle'
} satisfies ModuleConfig
