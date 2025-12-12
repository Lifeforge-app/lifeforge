import chalk from 'chalk'
import PocketBase from 'pocketbase'

import {
  AllPossibleFieldsForFilter,
  CollectionKey,
  ExpandConfig,
  FieldSelection,
  FilterType,
  SingleItemReturnType
} from '@functions/database/PBService/typescript/pb_service'
import { LoggingService } from '@functions/logging/loggingService'

import { PBServiceBase } from '../typescript/PBServiceBase.interface'
import getFinalCollectionName from '../utils/getFinalCollectionName'
import { recursivelyBuildFilter } from '../utils/recursivelyConstructFilter'

export class GetFirstListItem<
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

  async execute(): Promise<
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

    const result = await this._pb
      .collection(getFinalCollectionName(this.collectionKey))
      .getFirstListItem(filterString, {
        sort: this._sort,
        expand: this._expand,
        fields: this._fields
      })

    LoggingService.debug(
      `${chalk
        .hex('#82c8e5')
        .bold('getFirstListItem')} Fetched first item from ${chalk
        .hex('#34ace0')
        .bold(this.collectionKey)}`,
      'DB'
    )

    return result as unknown as SingleItemReturnType<
      TCollectionKey,
      TExpandConfig,
      TFields
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
