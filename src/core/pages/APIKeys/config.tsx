import { ModuleConfig } from '@core/routes/interfaces/routes_interfaces'
import { IconApi } from '@tabler/icons-react'
import { lazy } from 'react'

export default {
  name: 'API Explorer',
  icon: <IconApi />,
  routes: {
    api: lazy(() => import('.'))
  },
  togglable: false
} satisfies ModuleConfig
