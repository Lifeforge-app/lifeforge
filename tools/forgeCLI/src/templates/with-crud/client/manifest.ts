import { lazy } from 'react'
import type { ModuleConfig } from 'shared'

export default {
  name: '{{moduleName.en}}',
  icon: '{{moduleIcon}}',
  routes: {
    '{{kebab moduleName.en}}': lazy(() => import('@'))
  },
  category: '{{moduleCategory}}'
} satisfies ModuleConfig
