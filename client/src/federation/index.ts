import loadModules from './loaders/loadModules'
import FederationProvider, {
  useFederation
} from './providers/FederationProvider'

export { FederationProvider, useFederation, loadModules }

export type { GlobalProviderComponent } from './loaders/loadGlobalProvider'

export default FederationProvider
