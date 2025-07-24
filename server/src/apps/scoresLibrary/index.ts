import { forgeRouter } from '@functions/routes'

import entriesRouter from './routes/entries'
import guitarWorldRouter from './routes/guitarWorld'
import typesRouter from './routes/types'

export default forgeRouter({
  entries: entriesRouter,
  'guitar-world': guitarWorldRouter,
  types: typesRouter
})
