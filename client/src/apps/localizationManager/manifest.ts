import { lazy } from 'react'
import type { ModuleConfig } from 'shared'

export default {
  name: 'Localization Manager',
  icon: 'mingcute:translate-line',
  routes: {
    '/': lazy(() => import('.'))
  },
  disabled: !import.meta.env.VITE_LOCALIZATION_MANAGER_URL,
  category: 'SSO'
} satisfies ModuleConfig
