import {
  AllPossibleFieldsForFilter,
  CollectionKey,
  ExpandConfig,
  FieldSelection,
  FilterType,
  MultiItemsReturnType
} from '@functions/database/PBService/typescript/pb_service'
import PocketBase from 'pocketbase'

import { PBServiceBase } from '../typescript/PBServiceBase.interface'
import { recursivelyBuildFilter } from '../utils/recursivelyConstructFilter'

/**
 * Class for retrieving all records from PocketBase collections with filtering, sorting, and expansion capabilities
 * @template TCollectionKey - The collection key type
 * @template TExpandConfig - The expand configuration type
 * @template TFields - The field selection type
 */
export class GetFullList<
  TCollectionKey extends CollectionKey,
  TExpandConfig extends ExpandConfig<TCollectionKey> = Record<never, never>,
  TFields extends FieldSelection<TCollectionKey, TExpandConfig> = Record<
    never,
    never
  >
> implements PBServiceBase<TCollectionKey, TExpandConfig>
{
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
  filter(filter: FilterType<TCollectionKey, TExpandConfig>) {
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
      | AllPossibleFieldsForFilter<TCollectionKey, TExpandConfig>
      | `-${AllPossibleFieldsForFilter<TCollectionKey, TExpandConfig> extends string ? AllPossibleFieldsForFilter<TCollectionKey, TExpandConfig> : never}`
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
  fields<NewFields extends FieldSelection<TCollectionKey, TExpandConfig>>(
    fields: NewFields
  ): GetFullList<TCollectionKey, TExpandConfig, NewFields> {
    const newInstance = new GetFullList<
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
  expand<NewExpandConfig extends ExpandConfig<TCollectionKey>>(
    expandConfig: NewExpandConfig
  ): GetFullList<TCollectionKey, NewExpandConfig> {
    const newInstance = new GetFullList<TCollectionKey, NewExpandConfig>(
      this._pb,
      this.collectionKey
    )

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
  execute(): Promise<
    MultiItemsReturnType<TCollectionKey, TExpandConfig, TFields>
  > {
    if (!this.collectionKey) {
      throw new Error(
        'Collection key is required. Use .collection() method to set the collection key.'
      )
    }

    const filterString = this._filterExpression
      ? this._pb.filter(this._filterExpression, this._filterParams)
      : undefined

    return this._pb
      .collection((this.collectionKey as string).replace(/^users__/, ''))
      .getFullList({
        filter: filterString,
        sort: this._sort,
        expand: this._expand,
        fields: this._fields
      }) as unknown as Promise<
      MultiItemsReturnType<TCollectionKey, TExpandConfig, TFields>
    >
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
const getFullList = (pb: PocketBase) => ({
  /**
   * Specifies the collection to retrieve records from
   * @template TCollectionKey - The collection key type
   * @param collection - The collection key
   * @returns A new GetFullList instance for the specified collection
   */
  collection: <TCollectionKey extends CollectionKey>(
    collection: TCollectionKey
  ): GetFullList<TCollectionKey> => {
    return new GetFullList<TCollectionKey>(pb, collection)
  }
})

export default getFullList
