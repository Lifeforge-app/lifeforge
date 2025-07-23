import { forgeRouter } from '@functions/routes'

import entriesRouter from './routes/entries'
import masterRouter from './routes/master'

export default forgeRouter({
  '/master': masterRouter,
  '/entries': entriesRouter
})
