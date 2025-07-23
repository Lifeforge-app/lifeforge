import {
  CollectionKey,
  ExpandConfig,
  FieldKey,
  FieldSelection,
  FilterType,
  MultiItemsReturnType
} from '@functions/database/PBService/typescript/pb_crud.interfaces'
import PocketBase from 'pocketbase'

/**
 * Recursively builds filter expressions and parameters for PocketBase queries
 * @template TCollectionKey - The collection key type
 * @template TExpandConfig - The expand configuration type
 * @param filter - The filter configuration object
 * @param paramCounter - Counter for generating unique parameter names
 * @param params - Accumulated parameters object
 * @returns Object containing the filter expression string and parameters
 */
function recursivelyBuildFilter<
  TCollectionKey extends CollectionKey,
  TExpandConfig extends ExpandConfig<TCollectionKey>
>(
  filter: FilterType<TCollectionKey, TExpandConfig>,
  paramCounter: { count: number } = { count: 0 },
  params: Record<string, unknown> = {}
): { expression: string; params: Record<string, unknown> } {
  const expressions = filter.map(f => {
    if ('combination' in f) {
      const subFilters = f.filters.map(subFilter => {
        if ('combination' in subFilter) {
          const result = recursivelyBuildFilter(
            [subFilter],
            paramCounter,
            params
          )

          return `(${result.expression})`
        }

        const paramName = `param${paramCounter.count++}`

        params[paramName] = subFilter.value

        return `${String(subFilter.field)}${subFilter.operator}{:${paramName}}`
      })

      return `(${subFilters.join(` ${f.combination} `)})`
    }

    const paramName = `param${paramCounter.count++}`

    params[paramName] = f.value

    return `${String(f.field)}${f.operator}{:${paramName}}`
  })

  return {
    expression: expressions.join(' && '),
    params
  }
}

/**
 * Class for retrieving all records from PocketBase collections with filtering, sorting, and expansion capabilities
 * @template TCollectionKey - The collection key type
 * @template TExpandConfig - The expand configuration type
 * @template TFields - The field selection type
 */
class GetFullList<
  TCollectionKey extends CollectionKey,
  TExpandConfig extends ExpandConfig<TCollectionKey> = Record<never, never>,
  TFields extends FieldSelection<TCollectionKey, TExpandConfig> = Record<
    never,
    never
  >
> {
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
  sort(sort: (FieldKey<TCollectionKey> | `-${FieldKey<TCollectionKey>}`)[]) {
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
      : ''

    return this._pb
      .collection((this.collectionKey as string).replace(/^user__/, ''))
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
