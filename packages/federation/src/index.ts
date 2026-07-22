export {
  default as FederationProvider,
  useFederation,
  SYSTEM_CATEGORIES
} from './providers/FederationProvider'

export { bootstrapModules } from './loaders/bootstrapModules'

export { loadRemoteModuleConfig } from './loaders/loadRemoteModuleConfig'

export { type FederatedModule } from './utils/fetchModuleData'

export {
  ModuleMetadataProvider,
  useModuleMetadata
} from './providers/ModuleMetadataProvider'

export { default as createForgeModule } from './api/createForgeModule'
