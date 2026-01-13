import { forgeRouter } from '@lifeforge/server-sdk'

import entriesRouter from './routes/entries'

export default forgeRouter({
  entries: entriesRouter
})
