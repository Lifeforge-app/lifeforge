import { lazy } from 'react'

import { ModuleConfig } from '../../core/routes/interfaces/routes_interfaces'

export default {
  name: 'Youtube Summarizer',
  icon: 'tabler:brand-youtube',
  routes: {
    'youtube-summarizer': lazy(() => import('.'))
  },
  togglable: true,
  requiredAPIKeys: ['groq'],
  hasAI: true
} satisfies ModuleConfig
