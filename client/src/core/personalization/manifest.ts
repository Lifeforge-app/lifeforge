import { lazy } from 'react'
import type { ModuleCategory } from 'shared'

export default {
  routes: {
    '/': lazy(() => import('.'))
  },
  name: 'personalization',
  displayName: 'Personalization',
  version: '1.0.0',
  author: 'LifeForge <https://lifeforge.dev>',
  description: 'Personalization',
  icon: 'tabler:palette',
  category: 'Settings',
  APIKeyAccess: {}
} satisfies ModuleCategory['items'][number]
