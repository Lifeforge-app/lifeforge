import { forgeRouter } from '@functions/routes'

import categoriesRouter from './routes/categories'
import entriesRouter from './routes/entries'

export default forgeRouter({
  entries: entriesRouter,
  categories: categoriesRouter
})
