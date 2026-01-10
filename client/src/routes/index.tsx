import loadModules from '../federation/loadModules'

const { routes: ROUTES, globalProviders: GLOBAL_PROVIDERS } =
  await loadModules()

export { GLOBAL_PROVIDERS }

export default ROUTES
