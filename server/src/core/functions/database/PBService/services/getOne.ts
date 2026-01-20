import {
  CleanedSchemas,
  CollectionKey,
  ExpandConfig,
  FieldSelection,
  IGetOne,
  IGetOneFactory
} from '@lifeforge/server-utils'
import chalk from 'chalk'
import PocketBase from 'pocketbase'

import { toPocketBaseCollectionName } from '@functions/database/dbUtils'

import { PBLogger } from '..'
import getFinalCollectionName from '../utils/getFinalCollectionName'

/**
 * Class for retrieving a single record from PocketBase collections with field selection and expansion capabilities
 * @template TSchemas - The flattened schemas type
 * @template TCollectionKey - The collection key type
 * @template TExpandConfig - The expand configuration type
 * @template TFields - The field selection type
 */
export class GetOne<
  TSchemas extends CleanedSchemas,
  TCollectionKey extends CollectionKey<TSchemas>,
  TExpandConfig extends ExpandConfig<TSchemas, TCollectionKey> = Record<
    never,
    never
  >,
  TFields extends FieldSelection<TSchemas, TCollectionKey, TExpandConfig> =
    Record<never, never>
> implements IGetOne<TSchemas, TCollectionKey, TExpandConfig, TFields> {
  private _itemId: string = ''
  private _expand: string = ''
  private _fields: string = ''

  /**
   * Creates an instance of the GetOne class
   * @param _pb - The PocketBase instance
   * @param collectionKey - The collection key to retrieve the record from
   */
  constructor(
    private _pb: PocketBase,
    private collectionKey: TCollectionKey
  ) {}

  /**
   * Sets the ID of the record to retrieve
   * @param itemId - The unique identifier of the record to fetch
   * @returns The current GetOne instance for method chaining
   */
  id(itemId: string) {
    this._itemId = itemId

    return this
  }

  /**
   * Specifies which fields to return in the response
   * @template NewFields - The new field selection type
   * @param fields - Object specifying which fields to include in the response
   * @returns A new GetOne instance with the specified field selection
   */
  fields<
    NewFields extends FieldSelection<TSchemas, TCollectionKey, TExpandConfig>
  >(fields: NewFields) {
    const newInstance = new GetOne<
      TSchemas,
      TCollectionKey,
      TExpandConfig,
      NewFields
    >(this._pb, this.collectionKey)

    newInstance._itemId = this._itemId
    newInstance._expand = this._expand
    newInstance._fields = Object.keys(fields).join(', ')

    return newInstance
  }

  /**
   * Configures which related records to expand in the response
   * @template NewExpandConfig - The new expand configuration type
   * @param expandConfig - Object specifying which relations to expand
   * @returns A new GetOne instance with the specified expand configuration
   */
  expand<NewExpandConfig extends ExpandConfig<TSchemas, TCollectionKey>>(
    expandConfig: NewExpandConfig
  ) {
    const newInstance = new GetOne<TSchemas, TCollectionKey, NewExpandConfig>(
      this._pb,
      this.collectionKey
    )

    newInstance._itemId = this._itemId
    newInstance._expand = Object.keys(expandConfig).join(', ')
    newInstance._fields = ''

    return newInstance
  }

  /**
   * Executes the query and retrieves the specified record
   * @returns Promise that resolves to the record with applied field selection and expansions
   * @throws Error if collection key is not set
   * @throws Error if item ID is not provided
   */
  async execute() {
    if (!this.collectionKey) {
      throw new Error(
        'Collection key is required. Use .collection() method to set the collection key.'
      )
    }

    if (!this._itemId) {
      throw new Error(
        `Failed to retrieve record in collection "${this.collectionKey}". Item ID is required. Use .id() method to set the ID.`
      )
    }

    const result = this._pb
      .collection(getFinalCollectionName(this.collectionKey))
      .getOne(this._itemId, {
        expand: this._expand,
        fields: this._fields
      })

    PBLogger.debug(
      `${chalk.hex('#82c8e5').bold('getOne')} Fetched record with ID ${chalk
        .hex('#34ace0')
        .bold(
          this._itemId
        )} from ${chalk.hex('#34ace0').bold(this.collectionKey)}`
    )

    return result as ReturnType<
      IGetOne<TSchemas, TCollectionKey, TExpandConfig, TFields>['execute']
    >
  }
}

/**
 * Factory function for creating GetOne instances
 * @param pb - The PocketBase instance
 * @returns Object with collection method for specifying the target collection
 * @example
 * ```typescript
 * const user = await getOne(pb)
 *   .collection('users')
 *   .id('record_id_123')
 *   .fields({ name: true, email: true })
 *   .execute()
 * ```
 */
const getOne = <TSchemas extends CleanedSchemas>(
  pb: PocketBase,
  module: { id: string }
): IGetOneFactory<TSchemas> => ({
  /**
   * Specifies the collection to retrieve a record from
   * @template TCollectionKey - The collection key type
   * @param collection - The collection key
   * @returns A new GetOne instance for the specified collection
   */
  collection: <TCollectionKey extends CollectionKey<TSchemas>>(
    collection: TCollectionKey
  ) => {
    const finalCollectionName = toPocketBaseCollectionName(
      collection,
      module.id
    )

    return new GetOne<TSchemas, TCollectionKey>(
      pb,
      finalCollectionName as TCollectionKey
    )
  }
})

export default getOne
