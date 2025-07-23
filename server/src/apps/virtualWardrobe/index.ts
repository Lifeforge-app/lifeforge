import { forgeRouter } from '@functions/routes'

import entriesRouter from './routes/entries'
import sessionRouter from './routes/session'

export default forgeRouter({
  '/entries': entriesRouter,
  '/session': sessionRouter
})
