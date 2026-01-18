import {
  CleanedSchemas,
  CollectionKey,
  ExpandConfig,
  FieldSelection,
  ICreate,
  ICreateData,
  ICreateFactory
} from '@lifeforge/server-utils'
import chalk from 'chalk'
import PocketBase from 'pocketbase'

import { toPocketBaseCollectionName } from '@functions/database/dbUtils'

import { PBLogger } from '..'
import getFinalCollectionName from '../utils/getFinalCollectionName'

/**
 * Class for creating new records in PocketBase collections with type safety
 * @template TCollectionKey - The collection key type
 * @template TExpandConfig - The expand configuration type
 * @template TFields - The field selection type
 */
export class Create<
  TSchemas extends CleanedSchemas,
  TCollectionKey extends CollectionKey<TSchemas>,
  TExpandConfig extends ExpandConfig<TSchemas, TCollectionKey> = Record<
    never,
    never
  >,
  TFields extends FieldSelection<TSchemas, TCollectionKey, TExpandConfig> =
    Record<never, never>
> implements ICreate<TSchemas, TCollectionKey, TExpandConfig, TFields> {
  private _data: ICreateData<TSchemas, TCollectionKey> = {}
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
  data(data: ICreateData<TSchemas, TCollectionKey>) {
    this._data = data

    return this
  }

  /**
   * Specifies which fields to return in the response
   * @template NewFields - The new field selection type
   * @param fields - Object specifying which fields to include in the response
   * @returns A new Create instance with the specified field selection
   */
  fields<
    NewFields extends FieldSelection<TSchemas, TCollectionKey, TExpandConfig>
  >(fields: NewFields) {
    const newInstance = new Create<
      TSchemas,
      TCollectionKey,
      TExpandConfig,
      NewFields
    >(this._pb, this.collectionKey)

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
  expand<NewExpandConfig extends ExpandConfig<TSchemas, TCollectionKey>>(
    expandConfig: NewExpandConfig
  ) {
    const newInstance = new Create<TSchemas, TCollectionKey, NewExpandConfig>(
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
  async execute() {
    if (!this.collectionKey) {
      throw new Error(
        'Collection key is required. Use .collection() method to set the collection key.'
      )
    }

    if (Object.keys(this._data).length === 0) {
      throw new Error('Data is required. Use .data() method to set the data.')
    }

    const result = await this._pb
      .collection(getFinalCollectionName(this.collectionKey))
      .create(this._data, {
        expand: this._expand,
        fields: this._fields,
        requestKey: null
      })

    PBLogger.debug(
      `${chalk.hex('#2ed573').bold('create')} Created record with ID ${chalk
        .hex('#34ace0')
        .bold(result.id)} in ${chalk.hex('#34ace0').bold(this.collectionKey)}`
    )

    return result as Awaited<
      ReturnType<
        ICreate<TSchemas, TCollectionKey, TExpandConfig, TFields>['execute']
      >
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
const create = <TSchemas extends CleanedSchemas>(
  pb: PocketBase,
  module: { id: string }
): ICreateFactory<TSchemas> => ({
  /**
   * Specifies the collection to create records in
   * @template TCollectionKey - The collection key type
   * @param collection - The collection key
   * @returns A new Create instance for the specified collection
   */
  collection: <TCollectionKey extends CollectionKey<TSchemas>>(
    collection: TCollectionKey
  ) => {
    const finalCollectionName = toPocketBaseCollectionName(collection as string, module.id)

    return new Create<TSchemas, TCollectionKey>(
      pb,
      finalCollectionName as TCollectionKey
    )
  }
})

export default create
