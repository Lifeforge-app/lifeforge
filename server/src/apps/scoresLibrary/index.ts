import forgeRouter from '@functions/forgeRouter'

import entriesRouter from './controllers/entries'
import guitarWorldRouter from './controllers/guitarWorld'
import typesRouter from './controllers/types'

export default forgeRouter({
  '/entries': entriesRouter,
  '/guitar-world': guitarWorldRouter,
  '/types': typesRouter
})
