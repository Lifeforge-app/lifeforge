import { forgeRouter } from '@functions/routes'

import entriesRouter from './routes/entries'
import listsRouter from './routes/lists'

export default forgeRouter({
  '/lists': listsRouter,
  '/entries': entriesRouter
})
