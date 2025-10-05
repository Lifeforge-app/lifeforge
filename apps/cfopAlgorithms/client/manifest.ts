import { lazy } from 'react'
import type { ModuleConfig } from 'shared'

export default {
  name: 'CFOP Algorithms',
  icon: 'tabler:cube',
  routes: {
    'cfop-algorithms': lazy(() => import('@')),
    'cfop-algorithms/f2l': lazy(() => import('@/pages/F2L')),
    'cfop-algorithms/oll': lazy(() => import('@/pages/OLL')),
    'cfop-algorithms/pll': lazy(() => import('@/pages/PLL'))
  },
  category: '06.Information'
} satisfies ModuleConfig
