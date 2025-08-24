import forgeAPI from '@utils/forgeAPI'
import { lazy } from 'react'

import type { ModuleConfig } from '../../core/routes/interfaces/routes_interfaces'

export default {
  name: 'Journal',
  icon: 'tabler:pencil',
  hasAI: true,
  routes: {
    journal: lazy(() => import('.'))
  },
  togglable: true,
  otpControllers: {
    getChallenge: forgeAPI.journal.auth.getChallenge,
    verifyOTP: forgeAPI.journal.auth.validateOTP
  },
  requiredAPIKeys: ['openai']
} satisfies ModuleConfig
