import { forgeRouter } from '@functions/routes'

import * as categoriesRoutes from './routes/categories'
import * as modulesRoutes from './routes/modules'

export default forgeRouter({
  ...modulesRoutes,
  categories: categoriesRoutes
})
