import { forgeRouter } from '@functions/routes'

import railwayMapRouter from './routes/railwayMap'

export default forgeRouter({
  '/': railwayMapRouter
})
