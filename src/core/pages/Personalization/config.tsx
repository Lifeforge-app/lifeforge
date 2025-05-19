import { ModuleConfig } from '@core/routes/interfaces/routes_interfaces'
import { IconPalette } from '@tabler/icons-react'
import { lazy } from 'react'

export default {
  name: 'Personalization',
  icon: <IconPalette />,
  routes: {
    personalization: lazy(() => import('.'))
  },
  togglable: false
} satisfies ModuleConfig
