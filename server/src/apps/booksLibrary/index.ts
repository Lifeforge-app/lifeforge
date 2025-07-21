import forgeRouter from '@functions/forgeRouter'

import collectionsRouter from './controllers/collection'
import entriesRouter from './controllers/entries'
import fileTypesRouter from './controllers/fileTypes'
import languagesRouter from './controllers/languages'
import libgenRouter from './controllers/libgen'

export default forgeRouter({
  '/entries': entriesRouter,
  '/collections': collectionsRouter,
  '/languages': languagesRouter,
  '/file-types': fileTypesRouter,
  '/libgen': libgenRouter
})
