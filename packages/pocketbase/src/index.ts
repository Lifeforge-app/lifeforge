export {
  cleanSchemas,
  schemaWithPB,
  type RawSchemas,
  type CleanedSchemas
} from './utils/schemaUtils'

export { default as parseCollectionName } from './utils/parseCollectionName'

export type {
  IPBService,
  IPBServiceConstructor,
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
} from './types/service.interface'

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
} from './types/pb_service.types'

export { default as PBService } from './PBService'

export {
  default as checkDB,
  toPocketBaseCollectionName,
  validateEnvironmentVariables,
  connectToPocketBase
} from './dbUtils'

export { default as checkExistence } from './validation'
