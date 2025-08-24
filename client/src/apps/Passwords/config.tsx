import forgeAPI from '@utils/forgeAPI'
import { lazy } from 'react'

import type { ModuleConfig } from '../../core/routes/interfaces/routes_interfaces'

export default {
  name: 'Passwords',
  icon: 'tabler:key',
  routes: {
    passwords: lazy(() => import('.'))
  },
  otpControllers: {
    getChallenge: forgeAPI.passwords.master.getChallenge,
    verifyOTP: forgeAPI.passwords.master.validateOTP
  },
  togglable: true
} satisfies ModuleConfig
