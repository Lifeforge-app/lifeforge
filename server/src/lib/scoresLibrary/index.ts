import { forgeRouter } from '@functions/routes'

import collectionsRouter from './routes/collections'
import entriesRouter from './routes/entries'
import guitarWorldRouter from './routes/guitarWorld'
import typesRouter from './routes/types'

export default forgeRouter({
  entries: entriesRouter,
  guitarWorld: guitarWorldRouter,
  types: typesRouter,
  collections: collectionsRouter
})
