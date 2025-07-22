import forgeRouter from '@functions/forgeRouter'

import entriesRouter from './routes/entries'

export default forgeRouter({
  '/entries': entriesRouter
})
