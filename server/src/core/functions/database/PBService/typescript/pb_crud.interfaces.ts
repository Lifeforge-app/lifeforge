import COLLECTION_SCHEMAS from '@schema'
import { ZodArray, ZodObject, ZodType, z } from 'zod/v4'

export type SchemaWithPB<T> = T & {
  id: string
  collectionId: string
  collectionName: string
}

type BaseFilterOperator = '=' | '!=' | '>' | '<' | '>=' | '<=' | '~' | '!~'
type FilterOperator = `?${BaseFilterOperator}` | BaseFilterOperator

// Helper type to extract the shape from a ZodObject

type ExtractZodShape<T> = T extends ZodObject ? z.infer<T> : never

// Helper type to check if a field is an array type
type IsArrayField<T> = T extends ZodArray<ZodType> ? true : false

// Type for collection keys
type CollectionKey = keyof typeof COLLECTION_SCHEMAS

// Type for a specific collection schema
type CollectionSchema<K extends CollectionKey> = (typeof COLLECTION_SCHEMAS)[K]

// Type for field keys in a collection
type FieldKey<K extends CollectionKey> = string &
  keyof ExtractZodShape<CollectionSchema<K>>

// Helper type for expand configuration
type ExpandConfig<TCollectionKey extends CollectionKey> = Partial<
  Record<FieldKey<TCollectionKey>, CollectionKey>
>

type AllPossibleFieldsForFilter<
  TCollectionKey extends CollectionKey,
  TExpandConfig extends ExpandConfig<TCollectionKey>
> =
  | keyof SchemaWithPB<ExtractZodShape<CollectionSchema<TCollectionKey>>>
  | (keyof TExpandConfig extends never
      ? never
      : {
          [K in keyof TExpandConfig]: TExpandConfig[K] extends CollectionKey
            ? `${string & K}.${string & keyof SchemaWithPB<ExtractZodShape<CollectionSchema<TExpandConfig[K]>>>}`
            : never
        }[keyof TExpandConfig])

type AllPossibleFieldsForFieldSelection<
  TCollectionKey extends CollectionKey,
  TExpandConfig extends ExpandConfig<TCollectionKey>
> =
  | keyof SchemaWithPB<ExtractZodShape<CollectionSchema<TCollectionKey>>>
  | (keyof TExpandConfig extends never
      ? never
      : {
          [K in keyof TExpandConfig]: TExpandConfig[K] extends CollectionKey
            ? `expand.${string & K}.${string & keyof SchemaWithPB<ExtractZodShape<CollectionSchema<TExpandConfig[K]>>>}`
            : never
        }[keyof TExpandConfig])

type FilterType<
  TCollectionKey extends CollectionKey,
  TExpandConfig extends ExpandConfig<TCollectionKey> = Record<never, never>
> = Array<
  | {
      field: AllPossibleFieldsForFilter<TCollectionKey, TExpandConfig>
      operator: FilterOperator
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      value: any
    }
  | {
      combination: '&&' | '||'
      filters: FilterType<TCollectionKey, TExpandConfig>
    }
>

// Helper type for field selection object
type FieldSelection<
  TCollectionKey extends CollectionKey,
  TExpandConfig extends ExpandConfig<TCollectionKey>
> = Partial<
  Record<
    AllPossibleFieldsForFieldSelection<TCollectionKey, TExpandConfig>,
    true
  >
>

// Helper type to get the expanded data for a single expand item
type GetExpandedData<
  TCollectionKey extends CollectionKey,
  TExpandConfig extends ExpandConfig<TCollectionKey>,
  K extends keyof TExpandConfig,
  TCollectionShape = ExtractZodShape<CollectionSchema<TCollectionKey>>
> = K extends keyof TCollectionShape
  ? TExpandConfig[K] extends CollectionKey
    ? IsArrayField<TCollectionShape[K]> extends true
      ? Array<SchemaWithPB<ExtractZodShape<CollectionSchema<TExpandConfig[K]>>>>
      : SchemaWithPB<ExtractZodShape<CollectionSchema<TExpandConfig[K]>>>
    : never
  : never

// Helper type to build the expand object from TExpandConfig
type BuildExpandObject<
  TCollectionKey extends CollectionKey,
  TExpandConfig extends ExpandConfig<TCollectionKey>
> = {
  [K in keyof TExpandConfig]?: GetExpandedData<TCollectionKey, TExpandConfig, K>
}

// Helper type to pick only selected fields from the full result
export type PickSelectedFields<
  TCollectionKey extends CollectionKey,
  TExpandConfig extends ExpandConfig<TCollectionKey>,
  TFields extends FieldSelection<TCollectionKey, TExpandConfig>
> = {
  [K in keyof TFields as K extends keyof SchemaWithPB<
    ExtractZodShape<CollectionSchema<TCollectionKey>>
  >
    ? K
    : never]: K extends keyof SchemaWithPB<
    ExtractZodShape<CollectionSchema<TCollectionKey>>
  >
    ? SchemaWithPB<ExtractZodShape<CollectionSchema<TCollectionKey>>>[K]
    : never
} & (keyof TExpandConfig extends never
  ? Record<string, never>
  : {
      expand?: {
        [ExpandKey in keyof TExpandConfig]?: {
          [FieldKey in string &
            keyof SchemaWithPB<
              ExtractZodShape<
                CollectionSchema<
                  TExpandConfig[ExpandKey] extends CollectionKey
                    ? TExpandConfig[ExpandKey]
                    : never
                >
              >
            > as `expand.${string & ExpandKey}.${FieldKey}` extends keyof TFields
            ? FieldKey
            : never]?: SchemaWithPB<
            ExtractZodShape<
              CollectionSchema<
                TExpandConfig[ExpandKey] extends CollectionKey
                  ? TExpandConfig[ExpandKey]
                  : never
              >
            >
          >[FieldKey]
        }
      }
    })

type MultiItemsReturnType<
  TCollectionKey extends CollectionKey,
  TExpandConfig extends ExpandConfig<TCollectionKey>,
  TFields extends FieldSelection<TCollectionKey, TExpandConfig> = Record<
    never,
    never
  >
> = keyof TFields extends never
  ? keyof TExpandConfig extends never
    ? SchemaWithPB<ExtractZodShape<CollectionSchema<TCollectionKey>>>[]
    : (SchemaWithPB<ExtractZodShape<CollectionSchema<TCollectionKey>>> & {
        expand?: BuildExpandObject<TCollectionKey, TExpandConfig>
      })[]
  : PickSelectedFields<TCollectionKey, TExpandConfig, TFields>[]

type SingleItemReturnType<
  TCollectionKey extends CollectionKey,
  TExpandConfig extends ExpandConfig<TCollectionKey>,
  TFields extends FieldSelection<TCollectionKey, TExpandConfig> = Record<
    never,
    never
  >
> =
  MultiItemsReturnType<
    TCollectionKey,
    TExpandConfig,
    TFields
  > extends (infer U)[]
    ? U
    : never

export type {
  CollectionKey,
  FieldKey,
  FilterType,
  MultiItemsReturnType,
  SingleItemReturnType,
  AllPossibleFieldsForFieldSelection as AllPossibleFields,
  FieldSelection,
  ExpandConfig
}
