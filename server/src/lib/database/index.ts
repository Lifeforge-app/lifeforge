import { forgeRouter } from '@lifeforge/server-sdk'

import databaseCollectionsRouter from './routes/collections'

export default forgeRouter({
  collections: databaseCollectionsRouter
})
