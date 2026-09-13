import { createForgeModule } from '@lifeforge/federation'

import contract from './contract'

const { forgeAPI, ...manifest } = createForgeModule({
  routes: {},
  hidden: true,
  contract,
  widgets: [
    () => import('@/widgets/LocalIp'),
    () => import('@/widgets/Date'),
    () => import('@/widgets/Clock'),
    () => import('@/widgets/Quotes')
  ]
})

export default manifest

export { forgeAPI }
