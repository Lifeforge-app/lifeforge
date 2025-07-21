import forgeRouter from '@functions/forgeRouter'

import entriesRouter from './controllers/entries'

export default forgeRouter({
  '/entries': entriesRouter
})
