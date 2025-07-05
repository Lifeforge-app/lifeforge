import { ModuleConfig } from '@core/routes/interfaces/routes_interfaces'
import { IconHistory } from '@tabler/icons-react'
import { lazy } from 'react'

export default {
  name: 'Backups',
  icon: <IconHistory />,
  routes: {
    backups: lazy(() => import('.'))
  },
  togglable: false
} satisfies ModuleConfig
