export type {
  ModuleConfig,
  ModuleCategory
} from '@lifeforge/configs'

export {
  default as FederationProvider,
  useFederation,
  SYSTEM_CATEGORIES,
  type FederatedModuleCategory
} from './providers/FederationProvider'

export { default as loadModules } from './loaders/loadModules'

export {
  loadModuleConfig,
  type FederatedModule
} from './loaders/loadModuleConfig'

export {
  ModuleMetadataProvider,
  useModuleMetadata
} from './providers/ModuleMetadataProvider'

export { default as createForgeModuleClient } from './api/createForgeModuleClient'
