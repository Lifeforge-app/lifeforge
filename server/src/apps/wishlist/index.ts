import forgeRouter from '@functions/forgeRouter'

import entriesRouter from './controllers/entries'
import listsRouter from './controllers/lists'

export default forgeRouter({
  '/lists': listsRouter,
  '/entries': entriesRouter
})
