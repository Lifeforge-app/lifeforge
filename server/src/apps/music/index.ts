import { forgeRouter } from '@functions/routes'

import entriesRouter from './routes/entries'
import youtubeRouter from './routes/youtube'

export default forgeRouter({
  entries: entriesRouter,
  youtube: youtubeRouter
})
