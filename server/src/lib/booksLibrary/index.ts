import { forgeRouter } from '@functions/routes'

import collectionsRouter from './routes/collection'
import entriesRouter from './routes/entries'
import fileTypesRouter from './routes/fileTypes'
import languagesRouter from './routes/languages'
import libgenRouter from './routes/libgen'
import readStatusRouter from './routes/readStatus'

export default forgeRouter({
  entries: entriesRouter,
  collections: collectionsRouter,
  languages: languagesRouter,
  fileTypes: fileTypesRouter,
  readStatus: readStatusRouter,
  libgen: libgenRouter
})
