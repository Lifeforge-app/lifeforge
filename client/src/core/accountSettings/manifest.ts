import { lazy } from 'react'
import type { ModuleCategory } from 'shared'

export default {
  routes: {
    '/': lazy(() => import('.'))
  },
  hidden: true,
  name: 'account-settings',
  displayName: 'Account Settings',
  version: '1.0.0',
  author: 'LifeForge <https://lifeforge.dev>',
  description: 'Account Settings',
  icon: 'tabler:user',
  category: 'Settings',
  APIKeyAccess: {}
} satisfies ModuleCategory['items'][number]
