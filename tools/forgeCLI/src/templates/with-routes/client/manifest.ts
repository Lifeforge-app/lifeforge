import { lazy } from 'react'
import type { ModuleConfig } from 'shared'

export default {
  name: '{{moduleName.en}}',
  icon: '{{moduleIcon}}',
  routes: {
    '{{kabab moduleName.en}}': lazy(() => import('@/pages/EntryList')),
    '{{kabab moduleName.en}}/:id': lazy(() => import('@/pages/EntryDetails'))
  },
  category: '{{moduleCategory}}'
} satisfies ModuleConfig
