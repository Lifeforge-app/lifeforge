import { lazy } from 'react'
import type { ModuleConfig } from 'shared'

export default {
  name: 'Sin Chew Daily',
  icon: 'tabler:news',
  routes: {
    'sin-chew-daily': lazy(() => import('@'))
  },

  category: '06.Information'
} satisfies ModuleConfig
