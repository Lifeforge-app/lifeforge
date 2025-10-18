export * from 'react-router'
export {
  useQueryState,
  useQueryStates,
  parseAsString,
  parseAsStringEnum,
  parseAsBoolean,
  parseAsInteger
} from 'nuqs'

export { useAPIEndpoint } from './providers/APIEndpointProvider'

export { useAPIOnlineStatus } from './providers/APIOnlineStatusProvider'

export { usePersonalization } from './providers/PersonalizationProvider'

export { useSidebarState } from './providers/SidebarStateProvider'

export { default as AuthProvider } from './providers/AuthProvider'

export { default as APIEndpointProvider } from './providers/APIEndpointProvider'

export { default as PersonalizationProvider } from './providers/PersonalizationProvider'

export { default as BackgroundProvider } from './providers/BackgroundProvider'

export { default as APIOnlineStatusProvider } from './providers/APIOnlineStatusProvider'

export { default as SidebarStateProvider } from './providers/SidebarStateProvider'

export { default as ToastProvider } from './providers/ToastProvider'

export { default as SSOAuthProvider } from './providers/SSOAuthProvider'

export { default as SocketProvider } from './providers/SocketProvider'

export { default as NuqsProvider } from './providers/NuqsProvider'

export { default as usePromiseLoading } from './hooks/usePromiseLoading'

export { type SocketEvent, useSocketContext } from './providers/SocketProvider'

export { useAuth } from './providers/AuthProvider'

export { default as forceDown } from './utils/forceDown'

export { encrypt, decrypt } from './utils/encryption'

export {
  createForgeAPIClient,
  ForgeAPIClientController
} from './api/core/forgeAPIClient'

export type {
  InferClientControllerOutput as InferOutput,
  InferClientControllerInput as InferInput
} from './api/typescript/forge_api_client.types'

export type {
  IDashboardLayout,
  IBackdropFilters
} from './providers/PersonalizationProvider/interfaces/personalization_provider_interfaces'

export type {
  ModuleConfig,
  ModuleCategory
} from './interfaces/module_config.types'

export type { default as WidgetConfig } from './interfaces/widget_config.types'
