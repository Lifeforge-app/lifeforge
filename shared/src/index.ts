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
export { useMainSidebarState as useMainSidebarState } from './providers/SidebarStateProvider'
export { useAuth } from './providers/AuthProvider'
export { default as AuthProvider } from './providers/AuthProvider'
export { default as APIEndpointProvider } from './providers/APIEndpointProvider'
export { default as APIOnlineStatusProvider } from './providers/APIOnlineStatusProvider'
export { default as MainSidebarStateProvider } from './providers/SidebarStateProvider'
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
export {
  encrypt,
  decrypt,
  createEncryptionSession,
  decryptResponse,
  encryptRequest,
  isEncryptedResponse
} from './utils/encryption'
export { default as fetchAPI } from './utils/fetchAPI'

export { default as getBrowserInfo } from './utils/getBrowserInfo'
export { default as normalizeSubnamespace } from './utils/normalizeSubnamespace'
export { default as parseCollectionName } from './utils/parseCollectionName'
// Forge API client and types
export { default as createForgeProxy } from './api/core/createForgeProxy'
export { default as ForgeEndpoint } from './api/core/forgeEndpoint'
export type {
  ProxyTree,
  InferClientControllerOutput as InferOutput,
  InferClientControllerInput as InferInput
} from './api/typescript/forge_proxy.types'

// Some shared types
export type { default as WidgetConfig } from './interfaces/widget_config.types'
export { widgetConfigSchema } from './interfaces/widget_config.types'
export { globalProxyRegistry } from './api/core/registry'
