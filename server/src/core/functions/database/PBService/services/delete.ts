import { CollectionKey } from '@functions/database/PBService/typescript/pb_crud.interfaces'
import PocketBase from 'pocketbase'

/**
 * Class for deleting records from PocketBase collections with type safety
 * @template TCollectionKey - The collection key type
 */
export class Delete<TCollectionKey extends CollectionKey> {
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
  execute(): Promise<boolean> {
    if (!this.collectionKey) {
      throw new Error(
        'Collection key is required. Use .collection() method to set the collection key.'
      )
    }

    if (!this._recordId) {
      throw new Error('Record ID is required. Use .id() method to set the ID.')
    }

    return this._pb
      .collection((this.collectionKey as string).replace(/^user__/, ''))
      .delete(this._recordId)
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
