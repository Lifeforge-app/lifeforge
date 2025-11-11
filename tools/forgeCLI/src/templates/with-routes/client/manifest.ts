import { lazy } from 'react'
import type { ModuleConfig } from 'shared'

export default {
  name: '{{moduleName.en}}',
  icon: '{{moduleIcon}}',
  routes: {
    '{{kebab moduleName.en}}': lazy(() => import('@/pages/EntryList')),
    '{{kebab moduleName.en}}/:id': lazy(() => import('@/pages/EntryDetails'))
  },
  category: '{{moduleCategory}}'
} satisfies ModuleConfig
