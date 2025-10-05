import { lazy } from 'react'
import type { ModuleConfig } from 'shared'

export default {
  name: 'Sudoku',
  icon: 'uil:table',
  routes: {
    sudoku: lazy(() => import('@'))
  },
  category: '07.Utilities'
} satisfies ModuleConfig
