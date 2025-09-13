import { lazy } from 'react'

import type { ModuleConfig } from '../../../core/routes/interfaces/routes_interfaces'

export default {
  name: 'Scores Library',
  icon: 'tabler:file-music',
  routes: {
    'scores-library': lazy(() => import('.'))
  },
  togglable: true
} satisfies ModuleConfig
