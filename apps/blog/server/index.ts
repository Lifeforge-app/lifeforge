import { forgeRouter } from '@functions/routes'

import blogEntriesRouter from './routes/entries'

export default forgeRouter({
  entries: blogEntriesRouter
})
