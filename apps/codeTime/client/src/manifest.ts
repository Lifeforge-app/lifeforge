import { lazy } from 'react'
import type { ModuleConfig } from 'shared'

export default {
  name: 'Code Time',
  icon: 'tabler:code',
  routes: {
    'code-time': lazy(() => import('.'))
  },
  togglable: true,
  category: '01.Productivity'
} satisfies ModuleConfig
