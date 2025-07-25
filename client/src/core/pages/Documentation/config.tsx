import type { ModuleConfig } from '@core/routes/interfaces/routes_interfaces'
import { IconInfoCircle } from '@tabler/icons-react'
import { Navigate } from 'react-router'

export default {
  name: 'Documentation',
  icon: <IconInfoCircle />,
  routes: {
    documentation: () => {
      window.location.href =
        'https://docs.lifeforge.melvinchia.dev/getting-started/introduction'

      return <Navigate to="/" />
    }
  },
  togglable: false,
  forceDisable: !import.meta.env.VITE_LOCALIZATION_MANAGER_URL
} as ModuleConfig
