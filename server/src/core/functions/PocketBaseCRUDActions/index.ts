import PocketBase from 'pocketbase'

import create from './create'
import deleteRecord from './delete'
import getFullList from './getFullList'
import getOne from './getOne'
import update from './update'

/**
 * Main class that provides type-safe CRUD operations for PocketBase collections
 *
 * This class serves as a unified interface for all CRUD operations, providing
 * a fluent API with full TypeScript support for collection types, field selection,
 * filtering, sorting, and relation expansion.
 *
 * @example
 * ```typescript
 * const pb = new PocketBase('http://localhost:8090')
 * const crud = new PocketBaseCRUDActions(pb)
 *
 * // Create a new record
 * const newUser = await crud.create
 *   .collection('users')
 *   .data({ name: 'John', email: 'john@example.com' })
 *   .execute()
 *
 * // Get all records with filtering
 * const activeUsers = await crud.getFullList
 *   .collection('users')
 *   .filter([{ field: 'active', operator: '=', value: true }])
 *   .sort(['name'])
 *   .execute()
 *
 * // Get a single record
 * const user = await crud.getOne
 *   .collection('users')
 *   .id('record_id_123')
 *   .execute()
 *
 * // Update a record
 * const updatedUser = await crud.update
 *   .collection('users')
 *   .id('record_id_123')
 *   .data({ name: 'Jane Doe' })
 *   .execute()
 *
 * // Delete a record
 * const success = await crud.delete
 *   .collection('users')
 *   .id('record_id_123')
 *   .execute()
 * ```
 */
class PocketBaseCRUDActions {
  /**
   * Creates an instance of PocketBaseCRUDActions
   * @param instance - The PocketBase instance to use for all operations
   */
  constructor(public instance: PocketBase) {}

  /**
   * Provides access to getFullList operations for retrieving multiple records
   * with filtering, sorting, field selection, and relation expansion capabilities
   */
  public getFullList = getFullList(this.instance)

  /**
   * Provides access to getOne operations for retrieving a single record
   * with field selection and relation expansion capabilities
   */
  public getOne = getOne(this.instance)

  /**
   * Provides access to create operations for creating new records
   * with field selection and relation expansion capabilities for the response
   */
  public create = create(this.instance)

  /**
   * Provides access to update operations for modifying existing records
   * with field selection and relation expansion capabilities for the response
   */
  public update = update(this.instance)

  /**
   * Provides access to delete operations for removing records from collections
   */
  public delete = deleteRecord(this.instance)
}

export default PocketBaseCRUDActions
