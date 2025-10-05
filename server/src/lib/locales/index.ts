import { forgeRouter } from '@functions/routes'

import LocaleRouter from './routes/locales'
import ManagerRouter from './routes/localesManager'

export default forgeRouter({
  manager: ManagerRouter,
  ...LocaleRouter
})
