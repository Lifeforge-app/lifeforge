import { forgeRouter } from '@lifeforge/server-utils'

import * as loginRoutes from './routes/login'
import * as logoutRoutes from './routes/logout'
import * as meRoutes from './routes/me'
import * as refreshRoutes from './routes/refresh'

export default forgeRouter({
  login: loginRoutes.login,
  logout: logoutRoutes.logout,
  me: meRoutes.me,
  refresh: refreshRoutes.refresh
})
