import forgeRouter from '@functions/forgeRouter'

import entriesRouter from './controllers/entries'
import masterRouter from './controllers/master'

export default forgeRouter({
  '/master': masterRouter,
  '/entries': entriesRouter
})
