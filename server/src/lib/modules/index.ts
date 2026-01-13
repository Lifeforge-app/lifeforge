import { forgeRouter } from '@lifeforge/server-sdk'

import * as categoriesRoutes from './routes/categories'
import * as devModeRoutes from './routes/devMode'
import * as modulesRoutes from './routes/modules'

export default forgeRouter({
  ...modulesRoutes,
  categories: categoriesRoutes,
  devMode: devModeRoutes
})
