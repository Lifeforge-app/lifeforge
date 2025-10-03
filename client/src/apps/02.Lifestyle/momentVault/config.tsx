import { lazy } from 'react'
import type { ModuleConfig } from 'shared'

export default {
  name: 'Moment Vault',
  icon: 'tabler:history',
  hasAI: true,
  routes: {
    'moment-vault': lazy(() => import('.'))
  },
  togglable: true,
  requiredAPIKeys: ['openai']
} satisfies ModuleConfig
