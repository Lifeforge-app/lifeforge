import {
  AllPossibleFieldsForFilter,
  CollectionKey,
  ExpandConfig,
  FieldSelection,
  FilterType,
  MultiItemsReturnType
} from '@functions/database/PBService/typescript/pb_service'
import { LoggingService } from '@functions/logging/loggingService'
import chalk from 'chalk'
import PocketBase from 'pocketbase'

import { PBServiceBase } from '../typescript/PBServiceBase.interface'
import { recursivelyBuildFilter } from '../utils/recursivelyConstructFilter'

// Paginated return type for getList
type GetListReturnType<
  TCollectionKey extends CollectionKey,
  TExpandConfig extends ExpandConfig<TCollectionKey>,
  TFields extends FieldSelection<TCollectionKey, TExpandConfig> = Record<
    never,
    never
  >
> = {
  page: number
  perPage: number
  totalItems: number
  totalPages: number
  items: MultiItemsReturnType<TCollectionKey, TExpandConfig, TFields>
}

export class GetList<
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
  private _page: number = 1
  private _perPage: number = 30

  constructor(
    private _pb: PocketBase,
    private collectionKey: TCollectionKey
  ) {}

  page(page: number) {
    this._page = page

    return this
  }

  perPage(perPage: number) {
    this._perPage = perPage

    return this
  }

  filter(filter: FilterType<TCollectionKey, TExpandConfig>) {
    const result = recursivelyBuildFilter(filter)

    this._filterExpression = result.expression
    this._filterParams = result.params

    return this
  }

  sort(
    sort: (
      | AllPossibleFieldsForFilter<TCollectionKey, TExpandConfig>
      | `-${AllPossibleFieldsForFilter<TCollectionKey, TExpandConfig> extends string ? AllPossibleFieldsForFilter<TCollectionKey, TExpandConfig> : never}`
    )[]
  ) {
    this._sort = sort.join(', ')

    return this
  }

  fields<NewFields extends FieldSelection<TCollectionKey, TExpandConfig>>(
    fields: NewFields
  ): GetList<TCollectionKey, TExpandConfig, NewFields> {
    const newInstance = new GetList<TCollectionKey, TExpandConfig, NewFields>(
      this._pb,
      this.collectionKey
    )

    newInstance._filterExpression = this._filterExpression
    newInstance._filterParams = this._filterParams
    newInstance._sort = this._sort
    newInstance._expand = this._expand
    newInstance._fields = Object.keys(fields).join(', ')
    newInstance._page = this._page
    newInstance._perPage = this._perPage

    return newInstance
  }

  expand<NewExpandConfig extends ExpandConfig<TCollectionKey>>(
    expandConfig: NewExpandConfig
  ): GetList<TCollectionKey, NewExpandConfig> {
    const newInstance = new GetList<TCollectionKey, NewExpandConfig>(
      this._pb,
      this.collectionKey
    )

    newInstance._filterExpression = this._filterExpression
    newInstance._filterParams = this._filterParams
    newInstance._sort = this._sort
    newInstance._expand = Object.keys(expandConfig).join(', ')
    newInstance._fields = ''
    newInstance._page = this._page
    newInstance._perPage = this._perPage

    return newInstance
  }

  async execute(): Promise<
    GetListReturnType<TCollectionKey, TExpandConfig, TFields>
  > {
    if (!this.collectionKey) {
      throw new Error(
        'Collection key is required. Use .collection() method to set the collection key.'
      )
    }

    const filterString = this._filterExpression
      ? this._pb.filter(this._filterExpression, this._filterParams)
      : undefined

    const result = (await this._pb
      .collection((this.collectionKey as string).replace(/^user__/, ''))
      .getList(this._page, this._perPage, {
        filter: filterString,
        sort: this._sort,
        expand: this._expand,
        fields: this._fields
      })) as unknown as GetListReturnType<
      TCollectionKey,
      TExpandConfig,
      TFields
    >

    LoggingService.debug(
      `${chalk
        .hex('#34ace0')
        .bold(
          'getList'
        )} Fetched ${result.perPage} items${result.totalItems ? ` out of ${result.totalItems} items` : ''} from ${chalk
        .hex('#34ace0')
        .bold(this.collectionKey)}`,
      'DB'
    )

    return result
  }
}

const getList = (pb: PocketBase) => ({
  collection: <TCollectionKey extends CollectionKey>(
    collection: TCollectionKey
  ): GetList<TCollectionKey> => {
    return new GetList<TCollectionKey>(pb, collection)
  }
})

export default getList
