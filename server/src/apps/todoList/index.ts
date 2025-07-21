import forgeRouter from '@functions/forgeRouter'

import entriesRouter from './controllers/entries'
import listsRouter from './controllers/lists'
import prioritiesRouter from './controllers/priorities'
import tagsRouter from './controllers/tags'

export default forgeRouter({
  '/entries': entriesRouter,
  '/priorities': prioritiesRouter,
  '/lists': listsRouter,
  '/tags': tagsRouter
})
