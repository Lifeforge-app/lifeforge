import { lazy } from 'react'

import type { ModuleConfig } from '../../core/routes/interfaces/routes_interfaces'

export default {
  name: 'CFOP Algorithms',
  icon: 'tabler:cube',
  routes: {
    'cfop-algorithms': lazy(() => import('.')),
    'cfop-algorithms/f2l': lazy(() => import('./pages/F2L')),
    'cfop-algorithms/oll': lazy(() => import('./pages/OLL')),
    'cfop-algorithms/pll': lazy(() => import('./pages/PLL'))
  },
  togglable: true
} satisfies ModuleConfig
