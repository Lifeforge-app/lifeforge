import { lazy } from 'react'
import type { ModuleCategory } from 'shared'

export default {
  routes: {
    '/': lazy(() => import('.'))
  },
  name: 'dashboard',
  displayName: 'Dashboard',
  version: '1.0.0',
  author: 'LifeForge <https://lifeforge.dev>',
  description: 'Dashboard',
  icon: 'tabler:dashboard',
  category: '<START>',
  APIKeyAccess: {}
} satisfies ModuleCategory['items'][number]
