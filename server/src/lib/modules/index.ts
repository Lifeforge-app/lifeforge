import { forgeRouter } from '@functions/routes'
import TempFileManager from '@functions/utils/tempFileManager'

import * as categoriesRoutes from './routes/categories'
import * as devModeRoutes from './routes/devMode'
import * as modulesRoutes from './routes/modules'

export const devModeFile = new TempFileManager('module_dev_mode.json', 'array')

export default forgeRouter({
  ...modulesRoutes,
  categories: categoriesRoutes,
  devMode: devModeRoutes
})
