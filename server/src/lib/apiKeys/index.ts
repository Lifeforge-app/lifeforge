import { forgeRouter } from '@lifeforge/server-utils'

import entriesRouter from './routes/entries'

export default forgeRouter({
  entries: entriesRouter
})
