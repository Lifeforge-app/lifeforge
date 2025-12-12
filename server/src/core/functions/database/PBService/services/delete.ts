import chalk from 'chalk'
import PocketBase from 'pocketbase'

import { CollectionKey } from '@functions/database/PBService/typescript/pb_service'
import { LoggingService } from '@functions/logging/loggingService'
import { ClientError } from '@functions/routes/utils/response'

import { PBServiceBase } from '../typescript/PBServiceBase.interface'
import getFinalCollectionName from '../utils/getFinalCollectionName'

/**
 * Class for deleting records from PocketBase collections with type safety
 * @template TCollectionKey - The collection key type
 */
export class Delete<TCollectionKey extends CollectionKey>
  implements PBServiceBase<TCollectionKey>
{
  private _recordId: string = ''

  /**
   * Creates an instance of the Delete class
   * @param _pb - The PocketBase instance
   * @param collectionKey - The collection key to delete records from
   */
  constructor(
    private _pb: PocketBase,
    private collectionKey: TCollectionKey
  ) {}

  /**
   * Sets the ID of the record to delete
   * @param recordId - The unique identifier of the record to delete
   * @returns The current Delete instance for method chaining
   */
  id(recordId: string) {
    this._recordId = recordId

    return this
  }

  /**
   * Executes the delete operation
   * @returns Promise that resolves to true if the deletion was successful
   * @throws Error if collection key is not set
   * @throws Error if record ID is not provided
   */
  async execute(): Promise<boolean> {
    if (!this.collectionKey) {
      throw new Error(
        'Collection key is required. Use .collection() method to set the collection key.'
      )
    }

    if (!this._recordId) {
      throw new Error(
        `Failed to delete record in collection "${this.collectionKey}". Record ID is required. Use .id() method to set the ID.`
      )
    }

    try {
      const result = await this._pb
        .collection(getFinalCollectionName(this.collectionKey))
        .delete(this._recordId)

      LoggingService.debug(
        `${chalk.hex('#ff5252').bold('delete')} Deleted record with ID ${chalk
          .hex('#34ace0')
          .bold(
            this._recordId
          )} from ${chalk.hex('#34ace0').bold(this.collectionKey)}`,
        'DB'
      )

      return result
    } catch (err) {
      if (
        err instanceof Error &&
        err.message.includes(
          'Make sure that the record is not part of a required relation reference'
        )
      ) {
        throw new ClientError(
          `Failed to delete record in collection "${this.collectionKey}". The record is part of a required relation reference.`,
          409
        )
      }

      throw err
    }
  }
}

/**
 * Factory function for creating Delete instances
 * @param pb - The PocketBase instance
 * @returns Object with collection method for specifying the target collection
 * @example
 * ```typescript
 * const success = await deleteRecord(pb)
 *   .collection('users')
 *   .id('record_id_123')
 *   .execute()
 * ```
 */
const deleteRecord = (pb: PocketBase) => ({
  /**
   * Specifies the collection to delete records from
   * @template TCollectionKey - The collection key type
   * @param collection - The collection key
   * @returns A new Delete instance for the specified collection
   */
  collection: <TCollectionKey extends CollectionKey>(
    collection: TCollectionKey
  ): Delete<TCollectionKey> => {
    return new Delete<TCollectionKey>(pb, collection)
  }
})

export default deleteRecord
