import { lazy } from 'react'

import type { ModuleConfig } from '../../../core/routes/interfaces/routes_interfaces'

export default {
  name: 'Currency Converter',
  icon: 'tabler:currency-dollar',
  routes: {
    'currency-converter': lazy(() => import('.'))
  },
  togglable: true
} satisfies ModuleConfig
