export type {
  ModuleConfig,
  ModuleCategory,
  WidgetConfig
} from '@lifeforge/configs'

export { moduleConfigSchema, widgetConfigSchema } from '@lifeforge/configs'

export { default as createForgeModuleClient } from './api/createForgeModuleClient'

export {
  default as FederationProvider,
  useFederation,
  SYSTEM_CATEGORIES
} from './providers/FederationProvider'

export { default as loadModules } from './loaders/loadModules'

export {
  loadModuleConfig,
  fetchModuleManifest,
  type FederatedModule
} from './loaders/loadModuleConfig'

export { default as loadCoreModules } from './loaders/loadCoreModules'

export {
  sortRoutes,
  fetchCategoryOrder,
  type CategoryOrder
} from './utils/sortRoutes'

export {
  ModuleMetadataProvider,
  useModuleMetadata
} from './providers/ModuleMetadataProvider'
