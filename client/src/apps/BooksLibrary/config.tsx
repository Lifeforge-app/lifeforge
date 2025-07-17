import { ModuleConfig } from '@core/routes/interfaces/routes_interfaces'
import { lazy } from 'react'

export default {
  name: 'Books Library',
  icon: 'tabler:books',
  provider: lazy(() => import('./providers/BooksLibraryProvider')),
  routes: {
    '': lazy(() => import('.'))
  },
  togglable: true
} satisfies ModuleConfig
