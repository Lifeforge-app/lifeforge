import { forgeRouter } from '@lifeforge/server-utils'

import * as customRoutes from './routes/custom'
import * as googleRoutes from './routes/google'
import * as pinsRoutes from './routes/pins'

export default forgeRouter({
  google: googleRoutes,
  custom: customRoutes,
  pins: pinsRoutes
})
