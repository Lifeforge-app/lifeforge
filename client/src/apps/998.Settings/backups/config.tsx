import { lazy } from 'react'
import type { ModuleConfig } from 'shared'

export default {
  name: 'Backups',
  icon: 'tabler:history',
  routes: {
    backups: lazy(() => import('.'))
  }
} satisfies ModuleConfig
