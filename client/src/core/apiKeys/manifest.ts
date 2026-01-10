import { lazy } from 'react'
import type { ModuleCategory } from 'shared'

export default {
  routes: {
    '/': lazy(() => import('.'))
  },
  name: 'apiKeys',
  displayName: 'API Keys',
  version: '1.0.0',
  author: 'LifeForge <https://lifeforge.dev>',
  description: 'API Keys',
  icon: 'tabler:key',
  category: 'Settings',
  APIKeyAccess: {}
} satisfies ModuleCategory['items'][number]
