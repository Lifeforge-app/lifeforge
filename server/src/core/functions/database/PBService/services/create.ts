import {
  CollectionKey,
  ExpandConfig,
  FieldKey,
  FieldSelection,
  SingleItemReturnType
} from '@functions/database/PBService/typescript/pb_crud.interfaces'
import PocketBase from 'pocketbase'

/**
 * Type for create data - allows any field from the collection with any value
 * @template TCollectionKey - The collection key type
 */
type CreateData<TCollectionKey extends CollectionKey> = Partial<
  Record<FieldKey<TCollectionKey>, unknown>
>

/**
 * Class for creating new records in PocketBase collections with type safety
 * @template TCollectionKey - The collection key type
 * @template TExpandConfig - The expand configuration type
 * @template TFields - The field selection type
 */
export class Create<
  TCollectionKey extends CollectionKey,
  TExpandConfig extends ExpandConfig<TCollectionKey> = Record<never, never>,
  TFields extends FieldSelection<TCollectionKey, TExpandConfig> = Record<
    never,
    never
  >
> {
  private _data: CreateData<TCollectionKey> = {}
  private _expand: string = ''
  private _fields: string = ''

  /**
   * Creates an instance of the Create class
   * @param _pb - The PocketBase instance
   * @param collectionKey - The collection key to create records in
   */
  constructor(
    private _pb: PocketBase,
    private collectionKey: TCollectionKey
  ) {}

  /**
   * Sets the data to be created
   * @param data - The data object containing the fields to create
   * @returns The current Create instance for method chaining
   */
  data(data: CreateData<TCollectionKey>) {
    this._data = data

    return this
  }

  /**
   * Specifies which fields to return in the response
   * @template NewFields - The new field selection type
   * @param fields - Object specifying which fields to include in the response
   * @returns A new Create instance with the specified field selection
   */
  fields<NewFields extends FieldSelection<TCollectionKey, TExpandConfig>>(
    fields: NewFields
  ): Create<TCollectionKey, TExpandConfig, NewFields> {
    const newInstance = new Create<TCollectionKey, TExpandConfig, NewFields>(
      this._pb,
      this.collectionKey
    )

    newInstance._data = this._data
    newInstance._expand = this._expand
    newInstance._fields = Object.keys(fields).join(', ')

    return newInstance
  }

  /**
   * Configures which related records to expand in the response
   * @template NewExpandConfig - The new expand configuration type
   * @param expandConfig - Object specifying which relations to expand
   * @returns A new Create instance with the specified expand configuration
   */
  expand<NewExpandConfig extends ExpandConfig<TCollectionKey>>(
    expandConfig: NewExpandConfig
  ): Create<TCollectionKey, NewExpandConfig> {
    const newInstance = new Create<TCollectionKey, NewExpandConfig>(
      this._pb,
      this.collectionKey
    )

    newInstance._data = this._data
    newInstance._expand = Object.keys(expandConfig).join(', ')
    newInstance._fields = ''

    return newInstance
  }

  /**
   * Executes the create operation
   * @returns Promise that resolves to the created record with applied field selection and expansions
   * @throws Error if collection key is not set
   * @throws Error if data is not provided
   */
  execute(): Promise<
    SingleItemReturnType<TCollectionKey, TExpandConfig, TFields>
  > {
    if (!this.collectionKey) {
      throw new Error(
        'Collection key is required. Use .collection() method to set the collection key.'
      )
    }

    if (Object.keys(this._data).length === 0) {
      throw new Error('Data is required. Use .data() method to set the data.')
    }

    return this._pb
      .collection((this.collectionKey as string).replace(/^users__/, ''))
      .create(this._data, {
        expand: this._expand,
        fields: this._fields
      }) as unknown as Promise<
      SingleItemReturnType<TCollectionKey, TExpandConfig, TFields>
    >
  }
}

/**
 * Factory function for creating Create instances
 * @param pb - The PocketBase instance
 * @returns Object with collection method for specifying the target collection
 * @example
 * ```typescript
 * const result = await create(pb)
 *   .collection('users')
 *   .data({ name: 'John', email: 'john@example.com' })
 *   .execute()
 * ```
 */
const create = (pb: PocketBase) => ({
  /**
   * Specifies the collection to create records in
   * @template TCollectionKey - The collection key type
   * @param collection - The collection key
   * @returns A new Create instance for the specified collection
   */
  collection: <TCollectionKey extends CollectionKey>(
    collection: TCollectionKey
  ): Create<TCollectionKey> => {
    return new Create<TCollectionKey>(pb, collection)
  }
})

export default create
