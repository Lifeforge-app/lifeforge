import { IconAward } from '@tabler/icons-react'
import { lazy } from 'react'

import { ModuleConfig } from '../../core/routes/interfaces/routes_interfaces'

export default {
  name: 'Achievements',
  icon: <IconAward />,
  routes: {
    achievements: lazy(() => import('.'))
  },
  togglable: true
} satisfies ModuleConfig
