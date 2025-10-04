import { lazy } from 'react'
import type { ModuleConfig } from 'shared'

export default {
  name: 'Youtube Summarizer',
  icon: 'tabler:brand-youtube',
  routes: {
    'youtube-summarizer': lazy(() => import('@'))
  },
  togglable: true,
  requiredAPIKeys: ['groq'],
  hasAI: true,
  category: '07.Utilities'
} satisfies ModuleConfig
