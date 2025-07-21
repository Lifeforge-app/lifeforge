import forgeRouter from '@functions/forgeRouter'

import entriesRouter from './controllers/entries'
import youtubeRouter from './controllers/youtube'

export default forgeRouter({
  '/entries': entriesRouter,
  '/youtube': youtubeRouter
})
