import {
  AllPossibleFieldsForFilter,
  CleanedSchemas,
  CollectionKey,
  ExpandConfig,
  FieldSelection,
  FilterType,
  IGetFullList,
  IGetFullListFactory
} from '@lifeforge/server-utils'
import chalk from 'chalk'
import PocketBase from 'pocketbase'

import { toPocketBaseCollectionName } from '@functions/database/dbUtils'

import { PBLogger } from '..'
import getFinalCollectionName from '../utils/getFinalCollectionName'
import { recursivelyBuildFilter } from '../utils/recursivelyConstructFilter'

/**
 * Class for retrieving all records from PocketBase collections with filtering, sorting, and expansion capabilities
 * @template TSchemas - The flattened schemas type
 * @template TCollectionKey - The collection key type
 * @template TExpandConfig - The expand configuration type
 * @template TFields - The field selection type
 */
export class GetFullList<
  TSchemas extends CleanedSchemas,
  TCollectionKey extends CollectionKey<TSchemas>,
  TExpandConfig extends ExpandConfig<TSchemas, TCollectionKey> = Record<
    never,
    never
  >,
  TFields extends FieldSelection<TSchemas, TCollectionKey, TExpandConfig> =
    Record<never, never>
> implements IGetFullList<TSchemas, TCollectionKey, TExpandConfig, TFields> {
  private _filterExpression: string = ''
  private _filterParams: Record<string, unknown> = {}
  private _sort: string = ''
  private _expand: string = ''
  private _fields: string = ''

  /**
   * Creates an instance of the GetFullList class
   * @param _pb - The PocketBase instance
   * @param collectionKey - The collection key to retrieve records from
   */
  constructor(
    private _pb: PocketBase,
    private collectionKey: TCollectionKey
  ) {}

  /**
   * Sets the filter criteria for the query
   * @param filter - The filter configuration object specifying conditions
   * @returns The current GetFullList instance for method chaining
   */
  filter(filter: FilterType<TSchemas, TCollectionKey, TExpandConfig>) {
    const result = recursivelyBuildFilter(filter)

    this._filterExpression = result.expression
    this._filterParams = result.params

    return this
  }

  /**
   * Sets the sort order for the query results
   * @param sort - Array of field names for sorting. Prefix with '-' for descending order
   * @returns The current GetFullList instance for method chaining
   */
  sort(
    sort: (
      | AllPossibleFieldsForFilter<TSchemas, TCollectionKey, TExpandConfig>
      | `-${AllPossibleFieldsForFilter<TSchemas, TCollectionKey, TExpandConfig> extends string ? AllPossibleFieldsForFilter<TSchemas, TCollectionKey, TExpandConfig> : never}`
    )[]
  ) {
    this._sort = sort.join(', ')

    return this
  }

  /**
   * Specifies which fields to return in the response
   * @template NewFields - The new field selection type
   * @param fields - Object specifying which fields to include in the response
   * @returns A new GetFullList instance with the specified field selection
   */
  fields<
    NewFields extends FieldSelection<TSchemas, TCollectionKey, TExpandConfig>
  >(fields: NewFields) {
    const newInstance = new GetFullList<
      TSchemas,
      TCollectionKey,
      TExpandConfig,
      NewFields
    >(this._pb, this.collectionKey)

    newInstance._filterExpression = this._filterExpression
    newInstance._filterParams = this._filterParams
    newInstance._sort = this._sort
    newInstance._expand = this._expand
    newInstance._fields = Object.keys(fields).join(', ')

    return newInstance
  }

  /**
   * Configures which related records to expand in the response
   * @template NewExpandConfig - The new expand configuration type
   * @param expandConfig - Object specifying which relations to expand
   * @returns A new GetFullList instance with the specified expand configuration
   */
  expand<NewExpandConfig extends ExpandConfig<TSchemas, TCollectionKey>>(
    expandConfig: NewExpandConfig
  ) {
    const newInstance = new GetFullList<
      TSchemas,
      TCollectionKey,
      NewExpandConfig
    >(this._pb, this.collectionKey)

    newInstance._filterExpression = this._filterExpression
    newInstance._filterParams = this._filterParams
    newInstance._sort = this._sort
    newInstance._expand = Object.keys(expandConfig).join(', ')
    newInstance._fields = ''

    return newInstance
  }

  /**
   * Executes the query and retrieves all matching records
   * @returns Promise that resolves to an array of records with applied filters, sorting, field selection, and expansions
   * @throws Error if collection key is not set
   */
  async execute() {
    if (!this.collectionKey) {
      throw new Error(
        'Collection key is required. Use .collection() method to set the collection key.'
      )
    }

    const filterString = this._filterExpression
      ? this._pb.filter(this._filterExpression, this._filterParams)
      : undefined

    const result = (await this._pb
      .collection(getFinalCollectionName(this.collectionKey))
      .getFullList({
        filter: filterString,
        sort: this._sort,
        expand: this._expand,
        fields: this._fields
      })) as Awaited<
      ReturnType<
        IGetFullList<
          TSchemas,
          TCollectionKey,
          TExpandConfig,
          TFields
        >['execute']
      >
    >

    PBLogger.debug(
      `${chalk
        .hex('#82c8e5')
        .bold('getFullList')} Fetched ${result.length} items from ${chalk
        .hex('#34ace0')
        .bold(this.collectionKey)}`
    )

    return result
  }
}

/**
 * Factory function for creating GetFullList instances
 * @param pb - The PocketBase instance
 * @returns Object with collection method for specifying the target collection
 * @example
 * ```typescript
 * const users = await getFullList(pb)
 *   .collection('users')
 *   .filter([{ field: 'active', operator: '=', value: true }])
 *   .sort(['name', '-created'])
 *   .execute()
 * ```
 */
const getFullList = <TSchemas extends CleanedSchemas>(
  pb: PocketBase,
  module: { id: string }
): IGetFullListFactory<TSchemas> => ({
  /**
   * Specifies the collection to retrieve records from
   * @template TCollectionKey - The collection key type
   * @param collection - The collection key
   * @returns A new GetFullList instance for the specified collection
   */
  collection: <TCollectionKey extends CollectionKey<TSchemas>>(
    collection: TCollectionKey
  ) => {
    const finalCollectionName = toPocketBaseCollectionName(
      collection,
      module.id
    )

    return new GetFullList<TSchemas, TCollectionKey>(
      pb,
      finalCollectionName as TCollectionKey
    )
  }
})

export default getFullList
