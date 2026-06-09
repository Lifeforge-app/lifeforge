export { default as ClientError } from './routes/ClientError'

export {
  default as forgeRouter,
  type RouterInput,
  type ForgeRouter
} from './routes/forgeRouter'

export {
  cleanSchemas,
  schemaWithPB,
  type RawSchemas,
  type CleanedSchemas
} from './utils/schemaUtils'

export { default as getCallerModuleId } from './utils/getCallerModuleId'

export { default as parseCollectionName } from './utils/parseCollectionName'

export { Output, getStatusMessage } from './utils/outputStatus'

export type {
  default as IPBService,
  ICreate,
  ICreateData,
  ICreateFactory,
  IDelete,
  IDeleteFactory,
  IGetFullList,
  IGetFirstListItem,
  IGetFirstListItemFactory,
  IGetFullListFactory,
  IGetList,
  IGetListFactory,
  IGetListReturnType,
  IGetOne,
  IGetOneFactory,
  IUpdate,
  IUpdateData,
  IUpdateFactory
} from './typescript/pb/PBService.interface'

export type {
  SchemaWithPB,
  CollectionKey,
  CollectionKeyBracket,
  ExpandConfig,
  FilterType,
  FieldSelection,
  AllPossibleFieldsForFilter,
  AllPossibleFields,
  AllPossibleFieldsForFieldSelection,
  FieldKey,
  MultiItemsReturnType,
  PickSelectedFields,
  SingleItemReturnType
} from './typescript/pb/pb_service.types'

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
  ConvertMedia,
  ReplaceFileWithMulter
} from './typescript/standalone/media.types'

export type {
  OutputDefinition,
  OutputHelpers,
  ResponseObject,
  SnakeToCamel
} from './typescript/response/response_helpers.types'

export { type BaseResponse } from './typescript/response/response.types'

export type {
  CoreContext,
  AddToTaskPoolFunc,
  UpdateTaskInPoolFunc,
  GlobalTaskPool,
  TaskPoolTask,
  ConvertPDFToImageFunc,
  Decrypt2Func,
  DecryptFunc,
  Encrypt2Func,
  EncryptFunc,
  ParseOCRFunc,
  RetrieveMediaFunc,
  FetchAIFunc,
  SearchLocationsFunc,
  ValidateOTPFunc
} from './typescript/core/core_context.types'

export type { ITempFileManager } from './typescript/core/tempfile_manager.types'

export {
  type Location,
  LocationSchema
} from './typescript/standalone/location.types'

export {
  serializeRoutes,
  writeContractFileToClient
} from './utils/writeContractFile'
