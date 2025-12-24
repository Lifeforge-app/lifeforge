import { forgeRouter } from '@functions/routes'

import LocaleRouter from './routes/locales'

export default forgeRouter({
  // manager: ManagerRouter,
  ...LocaleRouter
})
