import { forgeRouter } from '@functions/routes'

import databaseCollectionsRouter from './routes/collections'

export default forgeRouter({
  '/collections': databaseCollectionsRouter
})
