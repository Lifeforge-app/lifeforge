import { forgeRouter } from '@functions/routes'

import entriesRouter from './routes/entries'

export default forgeRouter({
  entries: entriesRouter
})
