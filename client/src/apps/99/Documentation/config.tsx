import type { ModuleConfig } from '@core/routes/interfaces/routes_interfaces'
import { Navigate } from 'react-router'

export default {
  name: 'Documentation',
  icon: 'tabler:info-circle',
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
