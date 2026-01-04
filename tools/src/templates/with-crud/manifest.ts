import { lazy } from 'react'
import type { ModuleConfig } from 'shared'

export default {
  name: '{{moduleName.en}}',
  icon: '{{moduleIcon}}',
  routes: {
    '/': lazy(() => import('@'))
  },
  category: '{{moduleCategory}}'
} satisfies ModuleConfig
