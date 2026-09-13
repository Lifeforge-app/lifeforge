import { lazy } from 'react'

import { createForgeModule } from '@lifeforge/federation'

import contract from './contract'

const { forgeAPI, ...manifest } = createForgeModule({
  routes: {
    '/': lazy(() => import('@'))
  },
  contract
})

export default manifest

export { forgeAPI }
