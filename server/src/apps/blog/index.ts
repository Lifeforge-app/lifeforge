import forgeRouter from '@functions/forgeRouter'

import blogEntriesRouter from './routes/entries'

export default forgeRouter({
  '/entries': blogEntriesRouter
})
