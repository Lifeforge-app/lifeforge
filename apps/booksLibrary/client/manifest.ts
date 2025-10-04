import { lazy } from 'react'
import type { ModuleConfig } from 'shared'

export default {
  name: 'Books Library',
  icon: 'tabler:books',
  provider: lazy(() => import('@/providers/BooksLibraryProvider')),
  routes: {
    '': lazy(() => import('@'))
  },
  togglable: true,
  category: '04.Storage'
} satisfies ModuleConfig
