import { ModuleConfig } from '@core/routes/interfaces/routes_interfaces'
import { IconUserCog } from '@tabler/icons-react'
import { lazy } from 'react'

export default {
  name: 'Account Settings',
  icon: <IconUserCog />,
  routes: {
    account: lazy(() => import('.'))
  },
  togglable: false,
  hidden: true
} satisfies ModuleConfig
