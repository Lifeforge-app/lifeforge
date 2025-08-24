import type { ModuleConfig } from '@core/routes/interfaces/routes_interfaces'
import { IconPassword } from '@tabler/icons-react'
import forgeAPI from '@utils/forgeAPI'
import { lazy } from 'react'

export default {
  name: 'API Keys',
  icon: <IconPassword />,
  routes: {
    'api-keys': lazy(() => import('.'))
  },
  togglable: false,
  otpControllers: {
    getChallenge: forgeAPI.apiKeys.auth.getChallenge,
    verifyOTP: forgeAPI.apiKeys.auth.verifyOTP
  }
} satisfies ModuleConfig
