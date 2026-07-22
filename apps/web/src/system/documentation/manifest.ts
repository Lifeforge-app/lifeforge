import { lazy } from 'react'

import type { ModuleGroup } from '@lifeforge/configs'

export default {
  routes: {
    '/': lazy(() => import('./index'))
  },
  name: 'documentation',
  displayName: 'Documentation',
  version: '1.0.0',
  author: 'LifeForge <https://lifeforge.dev>',
  description: 'Documentation',
  icon: 'tabler:info-circle',
  category: '<END>',
  APIKeyAccess: {}
} as ModuleGroup['items'][number]
