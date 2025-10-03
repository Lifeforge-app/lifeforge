import { Navigate } from 'react-router'
import type { ModuleConfig } from 'shared'

export default {
  name: 'Documentation',
  icon: 'tabler:info-circle',
  routes: {
    documentation: () => {
      window.location.href = 'https://docs.lifeforge.melvinchia.dev'

      return <Navigate to="/" />
    }
  },
  togglable: false
} as ModuleConfig
