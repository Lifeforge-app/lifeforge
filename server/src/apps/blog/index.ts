import forgeRouter from '@functions/forgeRouter'

import blogEntriesRouter from './controllers/entries.contorller'

export default forgeRouter({
  '/entries': blogEntriesRouter
})
