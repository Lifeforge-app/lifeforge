import constructRoutes from './utils/initRoutes/constructRoutes'

const { routes: ROUTES, globalProviders: GLOBAL_PROVIDERS } =
  await constructRoutes()

export { GLOBAL_PROVIDERS }

export default ROUTES
