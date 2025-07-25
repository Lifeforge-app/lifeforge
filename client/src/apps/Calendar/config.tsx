import { IconCalendar } from '@tabler/icons-react'
import { lazy } from 'react'

import type { ModuleConfig } from '../../core/routes/interfaces/routes_interfaces'

export default {
  name: 'Calendar',
  icon: <IconCalendar />,
  routes: {
    calendar: lazy(() => import('.'))
  },
  togglable: true
} satisfies ModuleConfig
