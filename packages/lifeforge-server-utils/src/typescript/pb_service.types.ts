import { CleanedSchemas } from '@lifeforge/server-utils'
import { ZodArray, ZodObject, ZodType, z } from 'zod'

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
type CollectionKey<TSchemas extends CleanedSchemas> =
  keyof TSchemas extends string ? keyof TSchemas : never

// Type for a specific collection schema
type CollectionSchema<
  TSchemas extends CleanedSchemas,
  K extends CollectionKey<TSchemas>
> = TSchemas[K]

// Type for field keys in a collection
type FieldKey<
  TSchemas extends CleanedSchemas,
  K extends CollectionKey<TSchemas>
> = string & keyof ExtractZodShape<CollectionSchema<TSchemas, K>>

// Helper type for expand configuration
type ExpandConfig<
  TSchemas extends CleanedSchemas,
  TCollectionKey extends CollectionKey<TSchemas>
> = Partial<Record<FieldKey<TSchemas, TCollectionKey>, CollectionKey<TSchemas>>>

export type AllPossibleFieldsForFilter<
  TSchemas extends CleanedSchemas,
  TCollectionKey extends CollectionKey<TSchemas>,
  TExpandConfig extends ExpandConfig<TSchemas, TCollectionKey>
> =
  | keyof SchemaWithPB<
      ExtractZodShape<CollectionSchema<TSchemas, TCollectionKey>>
    >
  | (keyof TExpandConfig extends never
      ? never
      : {
          [K in keyof TExpandConfig]: TExpandConfig[K] extends CollectionKey<TSchemas>
            ? `${string & K}.${string & keyof SchemaWithPB<ExtractZodShape<CollectionSchema<TSchemas, TExpandConfig[K]>>>}`
            : never
        }[keyof TExpandConfig])

export type AllPossibleFieldsForFieldSelection<
  TSchemas extends CleanedSchemas,
  TCollectionKey extends CollectionKey<TSchemas>,
  TExpandConfig extends ExpandConfig<TSchemas, TCollectionKey>
> =
  | keyof SchemaWithPB<
      ExtractZodShape<CollectionSchema<TSchemas, TCollectionKey>>
    >
  | (keyof TExpandConfig extends never
      ? never
      : {
          [K in keyof TExpandConfig]: TExpandConfig[K] extends CollectionKey<TSchemas>
            ? `expand.${string & K}.${string & keyof SchemaWithPB<ExtractZodShape<CollectionSchema<TSchemas, TExpandConfig[K]>>>}`
            : never
        }[keyof TExpandConfig])

type FilterType<
  TSchemas extends CleanedSchemas,
  TCollectionKey extends CollectionKey<TSchemas>,
  TExpandConfig extends ExpandConfig<TSchemas, TCollectionKey> = Record<
    never,
    never
  >
> = Array<
  | {
      field: AllPossibleFieldsForFilter<TSchemas, TCollectionKey, TExpandConfig>
      operator: FilterOperator
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      value: any
    }
  | {
      combination: '&&' | '||'
      filters: FilterType<TSchemas, TCollectionKey, TExpandConfig>
    }
  | undefined
  | null
>

// Helper type for field selection object
type FieldSelection<
  TSchemas extends CleanedSchemas,
  TCollectionKey extends CollectionKey<TSchemas>,
  TExpandConfig extends ExpandConfig<TSchemas, TCollectionKey>
> = Partial<
  Record<
    AllPossibleFieldsForFieldSelection<TSchemas, TCollectionKey, TExpandConfig>,
    true
  >
>

// Helper type to get the expanded data for a single expand item
type GetExpandedData<
  TSchemas extends CleanedSchemas,
  TCollectionKey extends CollectionKey<TSchemas>,
  TExpandConfig extends ExpandConfig<TSchemas, TCollectionKey>,
  K extends keyof TExpandConfig,
  TCollectionShape = ExtractZodShape<CollectionSchema<TSchemas, TCollectionKey>>
> = K extends keyof TCollectionShape
  ? TExpandConfig[K] extends CollectionKey<TSchemas>
    ? IsArrayField<TCollectionShape[K]> extends true
      ? Array<
          SchemaWithPB<
            ExtractZodShape<CollectionSchema<TSchemas, TExpandConfig[K]>>
          >
        >
      : SchemaWithPB<
          ExtractZodShape<CollectionSchema<TSchemas, TExpandConfig[K]>>
        >
    : never
  : never

// Helper type to build the expand object from TExpandConfig
type BuildExpandObject<
  TSchemas extends CleanedSchemas,
  TCollectionKey extends CollectionKey<TSchemas>,
  TExpandConfig extends ExpandConfig<TSchemas, TCollectionKey>
> = {
  [K in keyof TExpandConfig]?: GetExpandedData<
    TSchemas,
    TCollectionKey,
    TExpandConfig,
    K
  >
}

// Helper type to pick only selected fields from the full result
export type PickSelectedFields<
  TSchemas extends CleanedSchemas,
  TCollectionKey extends CollectionKey<TSchemas>,
  TExpandConfig extends ExpandConfig<TSchemas, TCollectionKey> = Record<
    never,
    never
  >,
  TFields extends FieldSelection<TSchemas, TCollectionKey, TExpandConfig> =
    Record<never, never>
> = {
  [K in keyof TFields as K extends keyof SchemaWithPB<
    ExtractZodShape<CollectionSchema<TSchemas, TCollectionKey>>
  >
    ? K
    : never]: K extends keyof SchemaWithPB<
    ExtractZodShape<CollectionSchema<TSchemas, TCollectionKey>>
  >
    ? SchemaWithPB<
        ExtractZodShape<CollectionSchema<TSchemas, TCollectionKey>>
      >[K]
    : never
} & (keyof TExpandConfig extends never
  ? Record<string, any>
  : {
      expand?: {
        [ExpandKey in keyof TExpandConfig]?: {
          [FieldKey in string &
            keyof SchemaWithPB<
              ExtractZodShape<
                CollectionSchema<
                  TSchemas,
                  TExpandConfig[ExpandKey] extends CollectionKey<TSchemas>
                    ? TExpandConfig[ExpandKey]
                    : never
                >
              >
            > as `expand.${string & ExpandKey}.${FieldKey}` extends keyof TFields
            ? FieldKey
            : never]?: SchemaWithPB<
            ExtractZodShape<
              CollectionSchema<
                TSchemas,
                TExpandConfig[ExpandKey] extends CollectionKey<TSchemas>
                  ? TExpandConfig[ExpandKey]
                  : never
              >
            >
          >[FieldKey]
        }
      }
    })

type MultiItemsReturnType<
  TSchemas extends CleanedSchemas,
  TCollectionKey extends CollectionKey<TSchemas>,
  TExpandConfig extends ExpandConfig<TSchemas, TCollectionKey>,
  TFields extends FieldSelection<TSchemas, TCollectionKey, TExpandConfig> =
    Record<never, never>
> = keyof TFields extends never
  ? keyof TExpandConfig extends never
    ? SchemaWithPB<
        ExtractZodShape<CollectionSchema<TSchemas, TCollectionKey>>
      >[]
    : (SchemaWithPB<
        ExtractZodShape<CollectionSchema<TSchemas, TCollectionKey>>
      > & {
        expand?: BuildExpandObject<TSchemas, TCollectionKey, TExpandConfig>
      })[]
  : PickSelectedFields<TSchemas, TCollectionKey, TExpandConfig, TFields>[]

type SingleItemReturnType<
  TSchemas extends CleanedSchemas,
  TCollectionKey extends CollectionKey<TSchemas>,
  TExpandConfig extends ExpandConfig<TSchemas, TCollectionKey>,
  TFields extends FieldSelection<TSchemas, TCollectionKey, TExpandConfig> =
    Record<never, never>
> =
  MultiItemsReturnType<
    TSchemas,
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
