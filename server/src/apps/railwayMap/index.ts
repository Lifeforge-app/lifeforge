import forgeRouter from '@functions/forgeRouter'

import railwayMapRouter from './controllers/railwayMap'

export default forgeRouter({
  '/': railwayMapRouter
})
