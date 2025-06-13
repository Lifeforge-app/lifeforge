import { ModuleConfig } from '@core/routes/interfaces/routes_interfaces'
import { IconPassword } from '@tabler/icons-react'
import { lazy } from 'react'

export default {
  name: 'API Keys',
  icon: <IconPassword />,
  routes: {
    'api-keys': lazy(() => import('.'))
  },
  togglable: false
} satisfies ModuleConfig
