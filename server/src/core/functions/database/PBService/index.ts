import { CleanedSchemas, IPBService } from '@lifeforge/server-utils'
import PocketBase from 'pocketbase'

import { createServiceLogger } from '@functions/logging'

import create from './services/create'
import deleteRecord from './services/delete'
import getFirstListItem from './services/getFirstListItem'
import getFullList from './services/getFullList'
import getList from './services/getList'
import getOne from './services/getOne'
import update from './services/update'

export const PBLogger = createServiceLogger('Pocketbase')

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
 * // Get paginated records
 * const userPage = await crud.getList
 *   .collection('users')
 *   .page(1)
 *   .perPage(10)
 *   .filter([{ field: 'active', operator: '=', value: true }])
 *   .execute()
 *
 * // Get first matching record
 * const firstUser = await crud.getFirstListItem
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
class PBService<
  TSchemas extends CleanedSchemas
> implements IPBService<TSchemas> {
  /**
   * Creates an instance of PocketBaseCRUDActions
   * @param instance - The PocketBase instance to use for all operations
   */
  constructor(
    public instance: PocketBase,
    public module: { id: string }
  ) {}

  /**
   * Provides access to getFullList operations for retrieving multiple records
   * with filtering, sorting, field selection, and relation expansion capabilities
   */
  get getFullList() {
    return getFullList<TSchemas>(this.instance, this.module)
  }

  /**
   * Provides access to getList operations for retrieving paginated records
   * with filtering, sorting, field selection, relation expansion, and pagination capabilities
   */
  get getList() {
    return getList<TSchemas>(this.instance, this.module)
  }

  /**
   * Provides access to getFirstListItem operations for retrieving the first matching record
   * with filtering, sorting, field selection, and relation expansion capabilities
   */
  get getFirstListItem() {
    return getFirstListItem<TSchemas>(this.instance, this.module)
  }

  /**
   * Provides access to getOne operations for retrieving a single record
   * with field selection and relation expansion capabilities
   */
  get getOne() {
    return getOne<TSchemas>(this.instance, this.module)
  }

  /**
   * Provides access to create operations for creating new records
   * with field selection and relation expansion capabilities for the response
   */
  get create() {
    return create<TSchemas>(this.instance, this.module)
  }

  /**
   * Provides access to update operations for modifying existing records
   * with field selection and relation expansion capabilities for the response
   */
  get update() {
    return update<TSchemas>(this.instance, this.module)
  }

  /**
   * Provides access to delete operations for removing records from collections
   */
  get delete() {
    return deleteRecord<TSchemas>(this.instance, this.module)
  }
}

export default PBService
