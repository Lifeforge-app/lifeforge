import forgeRouter from '@functions/forgeRouter'

import databaseCollectionsRouter from './controllers/collections'

export default forgeRouter({
  '/collections': databaseCollectionsRouter
})
