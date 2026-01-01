/* eslint-disable padding-line-between-statements */
export * from 'react-router'

// Re-export nuqs hooks and parsers due to version mismatch issues
export {
  useQueryState,
  useQueryStates,
  parseAsString,
  parseAsStringEnum,
  parseAsBoolean,
  parseAsInteger
} from 'nuqs'

// Context providers
export { useEncryption } from './providers/EncryptionProvider'
export { useAPIEndpoint } from './providers/APIEndpointProvider'
export { useAPIOnlineStatus } from './providers/APIOnlineStatusProvider'
export { usePersonalization } from './providers/PersonalizationProvider'
export { useMainSidebarState as useMainSidebarState } from './providers/SidebarStateProvider'
export { useAuth } from './providers/AuthProvider'
export { default as AuthProvider } from './providers/AuthProvider'
export { default as APIEndpointProvider } from './providers/APIEndpointProvider'
export { default as PersonalizationProvider } from './providers/PersonalizationProvider'
export { default as BackgroundProvider } from './providers/BackgroundProvider'
export { default as APIOnlineStatusProvider } from './providers/APIOnlineStatusProvider'
export { default as MainSidebarStateProvider } from './providers/SidebarStateProvider'
export { default as ToastProvider } from './providers/ToastProvider'
export { default as SSOAuthProvider } from './providers/SSOAuthProvider'
export { default as SocketProvider } from './providers/SocketProvider'
export { default as NuqsProvider } from './providers/NuqsProvider'
export { default as EncryptionProvider } from './providers/EncryptionProvider'
export { type SocketEvent, useSocketContext } from './providers/SocketProvider'

// Useful hooks
export { default as usePromiseLoading } from './hooks/usePromiseLoading'
export { default as useDivSize } from './hooks/useDivSize'

// Useful utility functions
export { default as anyColorToHex } from './utils/anyColorToHex'
export { default as forceDown } from './utils/forceDown'
export { encrypt, decrypt } from './utils/encryption'

export { default as getFormFileFieldInitialData } from './utils/getFormFileFieldInitialData'
export { default as getBrowserInfo } from './utils/getBrowserInfo'

// Forge API client and types
export {
  createForgeAPIClient,
  ForgeAPIClientController
} from './api/core/forgeAPIClient'
export type {
  InferClientControllerOutput as InferOutput,
  InferClientControllerInput as InferInput
} from './api/typescript/forge_api_client.types'

// Some shared types
export type {
  IDashboardLayout,
  IBackdropFilters
} from './providers/PersonalizationProvider/interfaces/personalization_provider_interfaces'
export type {
  ModuleConfig,
  ModuleCategory
} from './interfaces/module_config.types'
export type { default as WidgetConfig } from './interfaces/widget_config.types'
