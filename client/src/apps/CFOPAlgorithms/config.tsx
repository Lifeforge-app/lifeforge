import { IconCube } from '@tabler/icons-react'
import { lazy } from 'react'

import type { ModuleConfig } from '../../core/routes/interfaces/routes_interfaces'

export default {
  name: 'CFOP Algorithms',
  icon: <IconCube />,
  routes: {
    'cfop-algorithms': lazy(() => import('.')),
    'cfop-algorithms/f2l': lazy(() => import('./pages/F2L')),
    'cfop-algorithms/oll': lazy(() => import('./pages/OLL')),
    'cfop-algorithms/pll': lazy(() => import('./pages/PLL'))
  },
  togglable: true
} satisfies ModuleConfig
