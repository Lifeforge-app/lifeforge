import { lazy } from 'react'
import type { ModuleCategory } from 'shared'

export default {
  routes: {
    '/': lazy(() => import('.'))
  },
  name: 'backups',
  displayName: 'Backups',
  version: '1.0.0',
  author: 'LifeForge <https://lifeforge.dev>',
  description: 'Backups',
  icon: 'tabler:history',
  category: 'Settings',
  APIKeyAccess: {}
} satisfies ModuleCategory['items'][number]
