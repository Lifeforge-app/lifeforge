import { forgeRouter } from '@lifeforge/server-utils'

import * as loginRoutes from './routes/login'
import * as logoutRoutes from './routes/logout'
import * as meRoutes from './routes/me'
import * as oauthAuthRoutes from './routes/oauth/authorization'
import * as oauthProviderRoutes from './routes/oauth/providers'
import * as refreshRoutes from './routes/refresh'
import * as twoFARoutes from './routes/twoFA'

export default forgeRouter({
  '2fa': twoFARoutes,
  login: loginRoutes.login,
  logout: logoutRoutes.logout,
  me: meRoutes.me,
  oauth: forgeRouter({
    ...oauthAuthRoutes,
    providers: oauthProviderRoutes
  }),
  refresh: refreshRoutes.refresh
})
