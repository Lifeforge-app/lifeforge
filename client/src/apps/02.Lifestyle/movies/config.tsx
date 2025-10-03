import { lazy } from 'react'
import type { ModuleConfig } from 'shared'

export default {
  name: 'Movies',
  icon: 'tabler:movie',
  routes: {
    movies: lazy(() => import('.'))
  },
  togglable: true,
  requiredAPIKeys: ['tmdb']
} satisfies ModuleConfig
