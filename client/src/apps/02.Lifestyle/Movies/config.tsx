import { lazy } from 'react'

import type { ModuleConfig } from '../../../core/routes/interfaces/routes_interfaces'

export default {
  name: 'Movies',
  icon: 'tabler:movie',
  routes: {
    movies: lazy(() => import('.'))
  },
  togglable: true,
  requiredAPIKeys: ['tmdb']
} satisfies ModuleConfig
