import forgeRouter from '@functions/forgeRouter'

import collectionsRouter from './routes/collection'
import entriesRouter from './routes/entries'
import fileTypesRouter from './routes/fileTypes'
import languagesRouter from './routes/languages'
import libgenRouter from './routes/libgen'

export default forgeRouter({
  '/entries': entriesRouter,
  '/collections': collectionsRouter,
  '/languages': languagesRouter,
  '/file-types': fileTypesRouter,
  '/libgen': libgenRouter
})
