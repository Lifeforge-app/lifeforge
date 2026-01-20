import { forgeRouter } from '@lifeforge/server-utils'

import databaseCollectionsRouter from './routes/collections'

export default forgeRouter({
  collections: databaseCollectionsRouter
})
