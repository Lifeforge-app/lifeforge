import forgeRouter from '@functions/forgeRouter'

import entriesRouter from './controllers/entries'
import sessionRouter from './controllers/session'

export default forgeRouter({
  '/entries': entriesRouter,
  '/session': sessionRouter
})
