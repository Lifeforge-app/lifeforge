export { default as ClientError } from './response/ClientError'

export { getStatusMessage } from './response/status'

export type { BaseResponse } from './response/types'

export { existsIn } from './database/existsIn'

export { checkRecordExistence } from './database/checkRecordExistence'

export { mapDatabaseError } from './database/mapDatabaseError'

export { ModuleRegistry } from '@lifeforge/module-runtime/registry'

export {
  default as forgeRouter,
  type RouterInput,
  type ForgeRouter
} from './routes/forgeRouter'

export {
  default as createForgeContractBuilder,
  default as createForge
} from './routes/forgeContract'

export type {
  ForgeContract,
  ForgeContext
} from './typescript/core/forge_contract.types'

export type {
  MediaConfig,
  ConvertMedia
} from './typescript/standalone/media.types'

export type {
  CoreContext,
  AddToTaskPoolFunc,
  UpdateTaskInPoolFunc,
  GlobalTaskPool,
  ConvertPDFToImageFunc,
  DecryptFunc,
  EncryptFunc,
  ParseOCRFunc,
  FetchAIFunc,
  SearchLocationsFunc
} from './typescript/core/core_context.types'

export type { ITempFileManager } from './typescript/core/tempfile_manager.types'

export { LocationSchema } from './typescript/standalone/location.types'

export {
  serializeEndpointValue,
  writeContractFileToClient
} from './utils/writeContractFile'

export { default as traceRouteStack } from './routes/traceRouteStack'
