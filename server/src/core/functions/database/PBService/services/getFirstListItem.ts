import {
  AllPossibleFieldsForFilter,
  CleanedSchemas,
  CollectionKey,
  ExpandConfig,
  FieldSelection,
  FilterType,
  IGetFirstListItem,
  IGetFirstListItemFactory
} from '@lifeforge/server-utils'
import chalk from 'chalk'
import PocketBase from 'pocketbase'

import { toPocketBaseCollectionName } from '@functions/database/dbUtils'

import { PBLogger } from '..'
import getFinalCollectionName from '../utils/getFinalCollectionName'
import { recursivelyBuildFilter } from '../utils/recursivelyConstructFilter'

export class GetFirstListItem<
  TSchemas extends CleanedSchemas,
  TCollectionKey extends CollectionKey<TSchemas>,
  TExpandConfig extends ExpandConfig<TSchemas, TCollectionKey> = Record<
    never,
    never
  >,
  TFields extends FieldSelection<TSchemas, TCollectionKey, TExpandConfig> =
    Record<never, never>
> implements IGetFirstListItem<
  TSchemas,
  TCollectionKey,
  TExpandConfig,
  TFields
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

  filter(filter: FilterType<TSchemas, TCollectionKey, TExpandConfig>) {
    const result = recursivelyBuildFilter(filter)

    this._filterExpression = result.expression
    this._filterParams = result.params

    return this
  }

  sort(
    sort: (
      | AllPossibleFieldsForFilter<TSchemas, TCollectionKey, TExpandConfig>
      | `-${AllPossibleFieldsForFilter<TSchemas, TCollectionKey, TExpandConfig> extends string ? AllPossibleFieldsForFilter<TSchemas, TCollectionKey, TExpandConfig> : never}`
    )[]
  ) {
    this._sort = sort.join(', ')

    return this
  }

  fields<
    NewFields extends FieldSelection<TSchemas, TCollectionKey, TExpandConfig>
  >(fields: NewFields) {
    const newInstance = new GetFirstListItem<
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

  expand<NewExpandConfig extends ExpandConfig<TSchemas, TCollectionKey>>(
    expandConfig: NewExpandConfig
  ) {
    const newInstance = new GetFirstListItem<
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

  async execute() {
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

    PBLogger.debug(
      `${chalk
        .hex('#82c8e5')
        .bold('getFirstListItem')} Fetched first item from ${chalk
        .hex('#34ace0')
        .bold(this.collectionKey)}`
    )

    return result as Awaited<
      ReturnType<
        IGetFirstListItem<
          TSchemas,
          TCollectionKey,
          TExpandConfig,
          TFields
        >['execute']
      >
    >
  }
}

const getFirstListItem = <TSchemas extends CleanedSchemas>(
  pb: PocketBase,
  module: { id: string }
): IGetFirstListItemFactory<TSchemas> => ({
  collection: <TCollectionKey extends CollectionKey<TSchemas>>(
    collection: TCollectionKey
  ) => {
    const finalCollectionName = toPocketBaseCollectionName(
      collection,
      module.id
    )

    return new GetFirstListItem<TSchemas, TCollectionKey>(
      pb,
      finalCollectionName as TCollectionKey
    )
  }
})

export default getFirstListItem
