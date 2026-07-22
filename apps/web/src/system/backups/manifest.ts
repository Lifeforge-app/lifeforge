import { lazy } from 'react'

import type { ModuleGroup } from '@lifeforge/configs'

export default {
  routes: {
    '/': lazy(() => import('.'))
  },
  name: 'backups',
  icon: 'tabler:history',
  category: 'Settings',
  APIKeyAccess: {}
} satisfies ModuleGroup['items'][number]
