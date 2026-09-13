import { lazy } from 'react'

import { createForgeModule } from '@lifeforge/federation'

import contract from './contract'

const { forgeAPI, ...manifest } = createForgeModule({
  provider: lazy(() => import('@/providers/PomodoroProviders')),
  routes: {
    '/': lazy(() => import('@'))
  },
  contract
})

export default manifest

export { forgeAPI }
