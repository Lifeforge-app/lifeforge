import forgeRouter from '@functions/forgeRouter'

import authRouter from './controllers/auth'
import entriesRouter from './controllers/entries'

export default forgeRouter({
  '/auth': authRouter,
  '/entries': entriesRouter
})
