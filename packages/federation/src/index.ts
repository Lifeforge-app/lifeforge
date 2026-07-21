export type { ModuleConfig, ModuleCategory } from '@lifeforge/configs'

export {
  default as FederationProvider,
  useFederation,
  SYSTEM_CATEGORIES,
  type FederatedModuleCategory
} from './providers/FederationProvider'

export { default as loadModules } from './loaders/loadModules'

export { loadModuleConfig } from './loaders/loadModuleConfig'

export { type FederatedModule } from './utils/fetchModuleData'

export {
  ModuleMetadataProvider,
  useModuleMetadata
} from './providers/ModuleMetadataProvider'

export { default as createForgeModule } from './api/createForgeModule'
