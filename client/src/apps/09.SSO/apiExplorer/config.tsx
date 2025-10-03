import { lazy } from 'react'
import type { ModuleConfig } from 'shared'

export default {
  name: 'API Explorer',
  icon: 'mynaui:api',
  routes: {
    'api-explorer': lazy(() => import('.'))
  },
  togglable: false,
  forceDisable: !import.meta.env.VITE_API_EXPLORER_URL
} satisfies ModuleConfig
