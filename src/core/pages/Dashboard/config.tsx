import { ModuleConfig } from '@core/routes/interfaces/routes_interfaces'
import { IconDashboard } from '@tabler/icons-react'
import { lazy } from 'react'

export default {
  name: 'Dashboard',
  icon: <IconDashboard />,
  routes: {
    dashboard: lazy(() => import('.'))
  },
  togglable: false
} satisfies ModuleConfig
