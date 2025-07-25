import { lazy } from 'react'

import type { ModuleConfig } from '../../core/routes/interfaces/routes_interfaces'

export default {
  name: 'Sudoku',
  icon: 'uil:table',
  routes: {
    sudoku: lazy(() => import('.'))
  },
  togglable: true
} satisfies ModuleConfig
