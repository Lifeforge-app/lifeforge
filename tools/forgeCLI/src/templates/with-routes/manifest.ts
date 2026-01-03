import { lazy } from 'react'
import type { ModuleConfig } from 'shared'

export default {
  name: '{{moduleName.en}}',
  icon: '{{moduleIcon}}',
  routes: {
    '/': lazy(() => import('@/pages/EntryList')),
    '/:id': lazy(() => import('@/pages/EntryDetails'))
  },
  category: '{{moduleCategory}}'
} satisfies ModuleConfig
