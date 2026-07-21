import { lazy } from 'react'

import type { ModuleGroup } from '@lifeforge/configs'

export default {
  routes: {
    '/': lazy(() => import('.'))
  },
  hidden: true,
  name: 'account-settings',
  icon: 'tabler:user',
  category: 'Settings',
  APIKeyAccess: {}
} satisfies ModuleGroup['items'][number]
