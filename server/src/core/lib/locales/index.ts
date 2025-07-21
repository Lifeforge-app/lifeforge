import forgeRouter from '@functions/forgeRouter'

import Router from './controllers/locales'
import ManagerRouter from './controllers/localesManager'

export default forgeRouter({
  '/manager': ManagerRouter,
  '/': Router
})
