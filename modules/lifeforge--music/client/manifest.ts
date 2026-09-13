import { lazy } from 'react'

import { createForgeModule } from '@lifeforge/federation'

import contract from './contract'

const { forgeAPI, ...manifest } = createForgeModule({
  provider: lazy(() => import('@/providers/MusicProvider')),
  routes: {
    '/': lazy(() => import('@'))
  },
  widgets: [() => import('@/widgets/MusicPlayer')],
  contract
})

export default manifest

export { forgeAPI }
