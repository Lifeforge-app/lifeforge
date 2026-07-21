import { lazy } from 'react'

import type { ModuleGroup } from '@lifeforge/configs'

export default {
  routes: {
    '/': lazy(() => import('.'))
  },
  name: 'personalization',
  icon: 'tabler:palette',
  category: 'Settings',
  APIKeyAccess: {}
} satisfies ModuleGroup['items'][number]
