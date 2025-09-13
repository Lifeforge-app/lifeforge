import { forgeRouter } from '@functions/routes'

import entriesRouter from './routes/entries'
import listsRouter from './routes/lists'
import prioritiesRouter from './routes/priorities'
import tagsRouter from './routes/tags'

export default forgeRouter({
  entries: entriesRouter,
  priorities: prioritiesRouter,
  lists: listsRouter,
  tags: tagsRouter
})
