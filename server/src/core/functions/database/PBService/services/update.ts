import {
  CollectionKey,
  ExpandConfig,
  FieldKey,
  FieldSelection,
  SingleItemReturnType
} from '@functions/database/PBService/typescript/pb_service'
import { LoggingService } from '@functions/logging/loggingService'
import chalk from 'chalk'
import PocketBase from 'pocketbase'

import { PBServiceBase } from '../typescript/PBServiceBase.interface'

/**
 * Type for update data - allows any field from the collection with any value
 * @template TCollectionKey - The collection key type
 */
type UpdateData<TCollectionKey extends CollectionKey> = Partial<
  Record<
    FieldKey<TCollectionKey> | `${FieldKey<TCollectionKey>}${'+' | '-'}`,
    unknown
  >
>

/**
 * Class for updating existing records in PocketBase collections with type safety
 * @template TCollectionKey - The collection key type
 * @template TExpandConfig - The expand configuration type
 * @template TFields - The field selection type
 */
export class Update<
  TCollectionKey extends CollectionKey,
  TExpandConfig extends ExpandConfig<TCollectionKey> = Record<never, never>,
  TFields extends FieldSelection<TCollectionKey, TExpandConfig> = Record<
    never,
    never
  >
> implements PBServiceBase<TCollectionKey, TExpandConfig>
{
  private _recordId: string = ''
  private _data: UpdateData<TCollectionKey> = {}
  private _expand: string = ''
  private _fields: string = ''

  /**
   * Creates an instance of the Update class
   * @param _pb - The PocketBase instance
   * @param collectionKey - The collection key to update records in
   */
  constructor(
    private _pb: PocketBase,
    private collectionKey: TCollectionKey
  ) {}

  /**
   * Sets the ID of the record to update
   * @param recordId - The unique identifier of the record to update
   * @returns The current Update instance for method chaining
   */
  id(recordId: string) {
    this._recordId = recordId

    return this
  }

  /**
   * Sets the data to be updated
   * @param data - The data object containing the fields to update
   * @returns The current Update instance for method chaining
   */
  data(data: UpdateData<TCollectionKey>) {
    this._data = data

    return this
  }

  /**
   * Specifies which fields to return in the response
   * @template NewFields - The new field selection type
   * @param fields - Object specifying which fields to include in the response
   * @returns A new Update instance with the specified field selection
   */
  fields<NewFields extends FieldSelection<TCollectionKey, TExpandConfig>>(
    fields: NewFields
  ): Update<TCollectionKey, TExpandConfig, NewFields> {
    const newInstance = new Update<TCollectionKey, TExpandConfig, NewFields>(
      this._pb,
      this.collectionKey
    )

    newInstance._recordId = this._recordId
    newInstance._data = this._data
    newInstance._expand = this._expand
    newInstance._fields = Object.keys(fields).join(', ')

    return newInstance
  }

  /**
   * Configures which related records to expand in the response
   * @template NewExpandConfig - The new expand configuration type
   * @param expandConfig - Object specifying which relations to expand
   * @returns A new Update instance with the specified expand configuration
   */
  expand<NewExpandConfig extends ExpandConfig<TCollectionKey>>(
    expandConfig: NewExpandConfig
  ): Update<TCollectionKey, NewExpandConfig> {
    const newInstance = new Update<TCollectionKey, NewExpandConfig>(
      this._pb,
      this.collectionKey
    )

    newInstance._recordId = this._recordId
    newInstance._data = this._data
    newInstance._expand = Object.keys(expandConfig).join(', ')
    newInstance._fields = ''

    return newInstance
  }

  /**
   * Executes the update operation
   * @returns Promise that resolves to the updated record with applied field selection and expansions
   * @throws Error if collection key is not set
   * @throws Error if record ID is not provided
   * @throws Error if data is not provided
   */
  async execute(): Promise<
    SingleItemReturnType<TCollectionKey, TExpandConfig, TFields>
  > {
    if (!this.collectionKey) {
      throw new Error(
        `Collection key is required. Use .collection() method to set the collection key.`
      )
    }

    if (!this._recordId) {
      throw new Error(
        `Failed to update record in collection "${this.collectionKey}". Record ID is required. Use .id() method to set the ID.`
      )
    }

    if (Object.keys(this._data).length === 0) {
      throw new Error(
        `Failed to update record in collection "${this.collectionKey}". Data is required. Use .data() method to set the data.`
      )
    }

    const result = await this._pb
      .collection((this.collectionKey as string).replace(/^user__/, ''))
      .update(this._recordId, this._data, {
        expand: this._expand,
        fields: this._fields
      })

    LoggingService.debug(
      `${chalk.hex('#2ed573').bold('update')} Updated record with ID ${chalk
        .hex('#34ace0')
        .bold(
          this._recordId
        )} in ${chalk.hex('#34ace0').bold(this.collectionKey)}`,
      'DB'
    )

    return result as unknown as SingleItemReturnType<
      TCollectionKey,
      TExpandConfig,
      TFields
    >
  }
}

/**
 * Factory function for creating Update instances
 * @param pb - The PocketBase instance
 * @returns Object with collection method for specifying the target collection
 * @example
 * ```typescript
 * const updatedUser = await update(pb)
 *   .collection('users')
 *   .id('record_id_123')
 *   .data({ name: 'John Doe', email: 'john.doe@example.com' })
 *   .execute()
 * ```
 */
const update = (pb: PocketBase) => ({
  /**
   * Specifies the collection to update records in
   * @template TCollectionKey - The collection key type
   * @param collection - The collection key
   * @returns A new Update instance for the specified collection
   */
  collection: <TCollectionKey extends CollectionKey>(
    collection: TCollectionKey
  ): Update<TCollectionKey> => {
    return new Update<TCollectionKey>(pb, collection)
  }
})

export default update
