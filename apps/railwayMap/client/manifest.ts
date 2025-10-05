import { lazy } from 'react'
import type { ModuleConfig } from 'shared'

export default {
  name: 'Railway Map',
  icon: 'uil:subway',
  provider: lazy(() => import('@/providers/RailwayMapProvider')),
  routes: {
    '': lazy(() => import('@'))
  },
  category: '06.Information'
} satisfies ModuleConfig
