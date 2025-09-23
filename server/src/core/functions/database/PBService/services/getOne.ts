import {
  CollectionKey,
  ExpandConfig,
  FieldSelection,
  SingleItemReturnType
} from '@functions/database/PBService/typescript/pb_service'
import { LoggingService } from '@functions/logging/loggingService'
import chalk from 'chalk'
import PocketBase from 'pocketbase'

import { PBServiceBase } from '../typescript/PBServiceBase.interface'

/**
 * Class for retrieving a single record from PocketBase collections with field selection and expansion capabilities
 * @template TCollectionKey - The collection key type
 * @template TExpandConfig - The expand configuration type
 * @template TFields - The field selection type
 */
export class GetOne<
  TCollectionKey extends CollectionKey,
  TExpandConfig extends ExpandConfig<TCollectionKey> = Record<never, never>,
  TFields extends FieldSelection<TCollectionKey, TExpandConfig> = Record<
    never,
    never
  >
> implements PBServiceBase<TCollectionKey, TExpandConfig>
{
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
  fields<NewFields extends FieldSelection<TCollectionKey, TExpandConfig>>(
    fields: NewFields
  ): GetOne<TCollectionKey, TExpandConfig, NewFields> {
    const newInstance = new GetOne<TCollectionKey, TExpandConfig, NewFields>(
      this._pb,
      this.collectionKey
    )

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
  expand<NewExpandConfig extends ExpandConfig<TCollectionKey>>(
    expandConfig: NewExpandConfig
  ): GetOne<TCollectionKey, NewExpandConfig> {
    const newInstance = new GetOne<TCollectionKey, NewExpandConfig>(
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
  async execute(): Promise<
    SingleItemReturnType<TCollectionKey, TExpandConfig, TFields>
  > {
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
      .collection((this.collectionKey as string).replace(/^users__/, ''))
      .getOne(this._itemId, {
        expand: this._expand,
        fields: this._fields
      })

    LoggingService.debug(
      `${chalk.hex('#34ace0').bold('getOne')} Fetched record with ID ${chalk
        .hex('#34ace0')
        .bold(
          this._itemId
        )} from ${chalk.hex('#34ace0').bold(this.collectionKey)}`,
      'DB'
    )

    return result as unknown as Promise<
      SingleItemReturnType<TCollectionKey, TExpandConfig, TFields>
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
const getOne = (pb: PocketBase) => ({
  /**
   * Specifies the collection to retrieve a record from
   * @template TCollectionKey - The collection key type
   * @param collection - The collection key
   * @returns A new GetOne instance for the specified collection
   */
  collection: <TCollectionKey extends CollectionKey>(
    collection: TCollectionKey
  ): GetOne<TCollectionKey> => {
    return new GetOne<TCollectionKey>(pb, collection)
  }
})

export default getOne
