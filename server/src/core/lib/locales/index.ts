import { forgeRouter } from '@functions/routes'

import Router from './routes/locales'
import ManagerRouter from './routes/localesManager'

export default forgeRouter({
  '/manager': ManagerRouter,
  '/': Router
})
