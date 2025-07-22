import { ZodArray, ZodObject, ZodType } from 'zod/v4'

import { ISchemaWithPB } from 'shared/types/collections'

import COLLECTION_SCHEMAS from './schema'

type BaseFilterOperator = '=' | '!=' | '>' | '<' | '>=' | '<=' | '~' | '!~'
type FilterOperator = `?${BaseFilterOperator}` | BaseFilterOperator

// Helper type to extract the shape from a ZodObject
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ExtractZodShape<T> = T extends ZodObject<infer U, any> ? U : never

// Helper type to check if a field is an array type
type IsArrayField<T> = T extends ZodArray<ZodType> ? true : false

// Type for collection keys
type CollectionKey = keyof typeof COLLECTION_SCHEMAS

// Type for a specific collection schema
type CollectionSchema<K extends CollectionKey> = (typeof COLLECTION_SCHEMAS)[K]

// Type for field keys in a collection
type FieldKey<K extends CollectionKey> = string &
  keyof ExtractZodShape<CollectionSchema<K>>

// Recursive filter type that supports expanded fields
type FilterType<
  TCollectionKey extends CollectionKey,
  TExpandConfig extends ExpandConfig<TCollectionKey> = Record<never, never>
> = Array<
  | {
      field: AllPossibleFields<TCollectionKey, TExpandConfig>
      operator: FilterOperator
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      value: any
    }
  | {
      combination: '&&' | '||'
      filters: FilterType<TCollectionKey, TExpandConfig>
    }
>

// Helper type for expand configuration
type ExpandConfig<TCollectionKey extends CollectionKey> = Partial<
  Record<FieldKey<TCollectionKey>, CollectionKey>
>

// Helper type to get all possible field keys including PB base fields and expanded fields
type AllPossibleFields<
  TCollectionKey extends CollectionKey,
  TExpandConfig extends ExpandConfig<TCollectionKey>
> =
  | keyof ISchemaWithPB<ExtractZodShape<CollectionSchema<TCollectionKey>>>
  | (keyof TExpandConfig extends never
      ? never
      : {
          [K in keyof TExpandConfig]: TExpandConfig[K] extends CollectionKey
            ? `expand.${string & K}.${string & keyof ISchemaWithPB<ExtractZodShape<CollectionSchema<TExpandConfig[K]>>>}`
            : never
        }[keyof TExpandConfig])

// Helper type for field selection object
type FieldSelection<
  TCollectionKey extends CollectionKey,
  TExpandConfig extends ExpandConfig<TCollectionKey>
> = Partial<Record<AllPossibleFields<TCollectionKey, TExpandConfig>, true>>

// Helper type to get the expanded data for a single expand item
type GetExpandedData<
  TCollectionKey extends CollectionKey,
  TExpandConfig extends ExpandConfig<TCollectionKey>,
  K extends keyof TExpandConfig,
  TCollectionShape = ExtractZodShape<CollectionSchema<TCollectionKey>>
> = K extends keyof TCollectionShape
  ? TExpandConfig[K] extends CollectionKey
    ? IsArrayField<TCollectionShape[K]> extends true
      ? Array<ExtractZodShape<CollectionSchema<TExpandConfig[K]>>>
      : ExtractZodShape<CollectionSchema<TExpandConfig[K]>>
    : never
  : never

// Helper type to build the expand object from TExpandConfig
type BuildExpandObject<
  TCollectionKey extends CollectionKey,
  TExpandConfig extends ExpandConfig<TCollectionKey>
> = {
  [K in keyof TExpandConfig]: GetExpandedData<TCollectionKey, TExpandConfig, K>
}

// Helper type to pick only selected fields from the full result
type PickSelectedFields<
  TCollectionKey extends CollectionKey,
  TExpandConfig extends ExpandConfig<TCollectionKey>,
  TFields extends FieldSelection<TCollectionKey, TExpandConfig>
> = {
  [K in keyof TFields as K extends keyof ISchemaWithPB<
    ExtractZodShape<CollectionSchema<TCollectionKey>>
  >
    ? K
    : never]: K extends keyof ISchemaWithPB<
    ExtractZodShape<CollectionSchema<TCollectionKey>>
  >
    ? ISchemaWithPB<ExtractZodShape<CollectionSchema<TCollectionKey>>>[K]
    : never
} & (keyof TExpandConfig extends never
  ? Record<string, never>
  : {
      expand?: {
        [ExpandKey in keyof TExpandConfig]?: {
          [FieldKey in string &
            keyof ISchemaWithPB<
              ExtractZodShape<
                CollectionSchema<
                  TExpandConfig[ExpandKey] extends CollectionKey
                    ? TExpandConfig[ExpandKey]
                    : never
                >
              >
            > as `expand.${string & ExpandKey}.${FieldKey}` extends keyof TFields
            ? FieldKey
            : never]?: ISchemaWithPB<
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
    ? ISchemaWithPB<ExtractZodShape<CollectionSchema<TCollectionKey>>>[]
    : (ISchemaWithPB<ExtractZodShape<CollectionSchema<TCollectionKey>>> & {
        expand: BuildExpandObject<TCollectionKey, TExpandConfig>
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
  AllPossibleFields,
  FieldSelection,
  ExpandConfig
}
