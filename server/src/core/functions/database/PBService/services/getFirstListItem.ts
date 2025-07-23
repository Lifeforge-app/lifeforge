import {
  CollectionKey,
  ExpandConfig,
  FieldKey,
  FieldSelection,
  FilterType,
  SingleItemReturnType
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

class GetFirstListItem<
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

  constructor(
    private _pb: PocketBase,
    private collectionKey: TCollectionKey
  ) {}

  filter(filter: FilterType<TCollectionKey, TExpandConfig>) {
    const result = recursivelyBuildFilter(filter)

    this._filterExpression = result.expression
    this._filterParams = result.params

    return this
  }

  sort(sort: (FieldKey<TCollectionKey> | `-${FieldKey<TCollectionKey>}`)[]) {
    this._sort = sort.join(', ')

    return this
  }

  fields<NewFields extends FieldSelection<TCollectionKey, TExpandConfig>>(
    fields: NewFields
  ): GetFirstListItem<TCollectionKey, TExpandConfig, NewFields> {
    const newInstance = new GetFirstListItem<
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

  expand<NewExpandConfig extends ExpandConfig<TCollectionKey>>(
    expandConfig: NewExpandConfig
  ): GetFirstListItem<TCollectionKey, NewExpandConfig> {
    const newInstance = new GetFirstListItem<TCollectionKey, NewExpandConfig>(
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

  execute(): Promise<
    SingleItemReturnType<TCollectionKey, TExpandConfig, TFields>
  > {
    if (!this.collectionKey) {
      throw new Error(
        'Collection key is required. Use .collection() method to set the collection key.'
      )
    }

    const filterString = this._filterExpression
      ? this._pb.filter(this._filterExpression, this._filterParams)
      : 'id != ""' // Default filter to ensure we get a valid response

    return this._pb
      .collection((this.collectionKey as string).replace(/^user__/, ''))
      .getFirstListItem(filterString, {
        sort: this._sort,
        expand: this._expand,
        fields: this._fields
      }) as unknown as Promise<
      SingleItemReturnType<TCollectionKey, TExpandConfig, TFields>
    >
  }
}

const getFirstListItem = (pb: PocketBase) => ({
  collection: <TCollectionKey extends CollectionKey>(
    collection: TCollectionKey
  ): GetFirstListItem<TCollectionKey> => {
    return new GetFirstListItem<TCollectionKey>(pb, collection)
  }
})

export default getFirstListItem
