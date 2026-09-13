import { lazy } from 'react'

import { createForgeModule } from '@lifeforge/federation'

import contract from './contract'

const { forgeAPI, ...manifest } = createForgeModule({
  routes: {
    '/': lazy(() => import('@'))
  },
  widgets: [() => import('@/widgets/CodeTime')],
  contract
})

export default manifest

export { forgeAPI }
