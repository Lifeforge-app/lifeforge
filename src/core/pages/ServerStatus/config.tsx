import { ModuleConfig } from '@core/routes/interfaces/routes_interfaces'
import { IconServer } from '@tabler/icons-react'
import { lazy } from 'react'

export default {
  name: 'Server Status',
  icon: <IconServer />,
  routes: {
    'server-status': lazy(() => import('.'))
  },
  togglable: false
} satisfies ModuleConfig
