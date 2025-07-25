import { lazy } from 'react'

import type { ModuleConfig } from '../../core/routes/interfaces/routes_interfaces'

export default {
  name: 'Youtube Videos',
  icon: 'tabler:brand-youtube',
  routes: {
    'youtube-videos': lazy(() => import('.'))
  },
  togglable: true
} satisfies ModuleConfig
