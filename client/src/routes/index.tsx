import constructRoutes from './utils/initRoutes/constructRoutes'

const ROUTES = await constructRoutes()

import.meta.glob('../../../apps/**/client/index.css', {
  eager: true
})

export default ROUTES
