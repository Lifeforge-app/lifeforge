import { lazy } from 'react'
import type { ModuleCategory } from 'shared'

export default {
  routes: {
    '/': lazy(() => import('.'))
  },
  name: 'documentation',
  displayName: 'Documentation',
  version: '1.0.0',
  author: 'LifeForge <https://lifeforge.dev>',
  description: 'Documentation',
  icon: 'tabler:info-circle',
  category: '<END>',
  APIKeyAccess: {}
} as ModuleCategory['items'][number]
