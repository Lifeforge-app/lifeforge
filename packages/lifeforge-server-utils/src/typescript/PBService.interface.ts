import { CleanedSchemas } from '@lifeforge/server-utils'
import PocketBase from 'pocketbase'

import {
  AllPossibleFieldsForFilter,
  CollectionKey,
  ExpandConfig,
  FieldKey,
  FieldSelection,
  FilterType,
  MultiItemsReturnType,
  SingleItemReturnType
} from './pb_service.types'

// ==================== GetFullList Interface ====================

export interface IGetFullList<
  TSchemas extends CleanedSchemas,
  TCollectionKey extends CollectionKey<TSchemas>,
  TExpandConfig extends ExpandConfig<TSchemas, TCollectionKey> = Record<
    never,
    never
  >,
  TFields extends FieldSelection<TSchemas, TCollectionKey, TExpandConfig> =
    Record<never, never>
> {
  filter(
    filter: FilterType<TSchemas, TCollectionKey, TExpandConfig>
  ): IGetFullList<TSchemas, TCollectionKey, TExpandConfig, TFields>

  sort(
    sort: (
      | AllPossibleFieldsForFilter<TSchemas, TCollectionKey, TExpandConfig>
      | `-${AllPossibleFieldsForFilter<TSchemas, TCollectionKey, TExpandConfig> extends string ? AllPossibleFieldsForFilter<TSchemas, TCollectionKey, TExpandConfig> : never}`
    )[]
  ): IGetFullList<TSchemas, TCollectionKey, TExpandConfig, TFields>

  fields<
    NewFields extends FieldSelection<TSchemas, TCollectionKey, TExpandConfig>
  >(
    fields: NewFields
  ): IGetFullList<TSchemas, TCollectionKey, TExpandConfig, NewFields>

  expand<NewExpandConfig extends ExpandConfig<TSchemas, TCollectionKey>>(
    expandConfig: NewExpandConfig
  ): IGetFullList<TSchemas, TCollectionKey, NewExpandConfig>

  execute(): Promise<
    MultiItemsReturnType<TSchemas, TCollectionKey, TExpandConfig, TFields>
  >
}

export interface IGetFullListFactory<TSchemas extends CleanedSchemas> {
  collection<TCollectionKey extends CollectionKey<TSchemas>>(
    collectionKey: TCollectionKey
  ): IGetFullList<TSchemas, TCollectionKey>
}

// ==================== GetList Interface ====================

export type IGetListReturnType<
  TSchemas extends CleanedSchemas,
  TCollectionKey extends CollectionKey<TSchemas>,
  TExpandConfig extends ExpandConfig<TSchemas, TCollectionKey>,
  TFields extends FieldSelection<TSchemas, TCollectionKey, TExpandConfig> =
    Record<never, never>
> = {
  page: number
  perPage: number
  totalItems: number
  totalPages: number
  items: MultiItemsReturnType<TSchemas, TCollectionKey, TExpandConfig, TFields>
}

export interface IGetList<
  TSchemas extends CleanedSchemas,
  TCollectionKey extends CollectionKey<TSchemas>,
  TExpandConfig extends ExpandConfig<TSchemas, TCollectionKey> = Record<
    never,
    never
  >,
  TFields extends FieldSelection<TSchemas, TCollectionKey, TExpandConfig> =
    Record<never, never>
> {
  page(page: number): IGetList<TSchemas, TCollectionKey, TExpandConfig, TFields>

  perPage(
    perPage: number
  ): IGetList<TSchemas, TCollectionKey, TExpandConfig, TFields>

  filter(
    filter: FilterType<TSchemas, TCollectionKey, TExpandConfig>
  ): IGetList<TSchemas, TCollectionKey, TExpandConfig, TFields>

  sort(
    sort: (
      | AllPossibleFieldsForFilter<TSchemas, TCollectionKey, TExpandConfig>
      | `-${AllPossibleFieldsForFilter<TSchemas, TCollectionKey, TExpandConfig> extends string ? AllPossibleFieldsForFilter<TSchemas, TCollectionKey, TExpandConfig> : never}`
    )[]
  ): IGetList<TSchemas, TCollectionKey, TExpandConfig, TFields>

  fields<
    NewFields extends FieldSelection<TSchemas, TCollectionKey, TExpandConfig>
  >(
    fields: NewFields
  ): IGetList<TSchemas, TCollectionKey, TExpandConfig, NewFields>

  expand<NewExpandConfig extends ExpandConfig<TSchemas, TCollectionKey>>(
    expandConfig: NewExpandConfig
  ): IGetList<TSchemas, TCollectionKey, NewExpandConfig>

  execute(): Promise<
    IGetListReturnType<TSchemas, TCollectionKey, TExpandConfig, TFields>
  >
}

export interface IGetListFactory<TSchemas extends CleanedSchemas> {
  collection<TCollectionKey extends CollectionKey<TSchemas>>(
    collectionKey: TCollectionKey
  ): IGetList<TSchemas, TCollectionKey>
}

// ==================== GetFirstListItem Interface ====================

export interface IGetFirstListItem<
  TSchemas extends CleanedSchemas,
  TCollectionKey extends CollectionKey<TSchemas>,
  TExpandConfig extends ExpandConfig<TSchemas, TCollectionKey> = Record<
    never,
    never
  >,
  TFields extends FieldSelection<TSchemas, TCollectionKey, TExpandConfig> =
    Record<never, never>
> {
  filter(
    filter: FilterType<TSchemas, TCollectionKey, TExpandConfig>
  ): IGetFirstListItem<TSchemas, TCollectionKey, TExpandConfig, TFields>

  sort(
    sort: (
      | AllPossibleFieldsForFilter<TSchemas, TCollectionKey, TExpandConfig>
      | `-${AllPossibleFieldsForFilter<TSchemas, TCollectionKey, TExpandConfig> extends string ? AllPossibleFieldsForFilter<TSchemas, TCollectionKey, TExpandConfig> : never}`
    )[]
  ): IGetFirstListItem<TSchemas, TCollectionKey, TExpandConfig, TFields>

  fields<
    NewFields extends FieldSelection<TSchemas, TCollectionKey, TExpandConfig>
  >(
    fields: NewFields
  ): IGetFirstListItem<TSchemas, TCollectionKey, TExpandConfig, NewFields>

  expand<NewExpandConfig extends ExpandConfig<TSchemas, TCollectionKey>>(
    expandConfig: NewExpandConfig
  ): IGetFirstListItem<TSchemas, TCollectionKey, NewExpandConfig>

  execute(): Promise<
    SingleItemReturnType<TSchemas, TCollectionKey, TExpandConfig, TFields>
  >
}

export interface IGetFirstListItemFactory<TSchemas extends CleanedSchemas> {
  collection<TCollectionKey extends CollectionKey<TSchemas>>(
    collectionKey: TCollectionKey
  ): IGetFirstListItem<TSchemas, TCollectionKey>
}

// ==================== GetOne Interface ====================

export interface IGetOne<
  TSchemas extends CleanedSchemas,
  TCollectionKey extends CollectionKey<TSchemas>,
  TExpandConfig extends ExpandConfig<TSchemas, TCollectionKey> = Record<
    never,
    never
  >,
  TFields extends FieldSelection<TSchemas, TCollectionKey, TExpandConfig> =
    Record<never, never>
> {
  id(itemId: string): IGetOne<TSchemas, TCollectionKey, TExpandConfig, TFields>

  fields<
    NewFields extends FieldSelection<TSchemas, TCollectionKey, TExpandConfig>
  >(
    fields: NewFields
  ): IGetOne<TSchemas, TCollectionKey, TExpandConfig, NewFields>

  expand<NewExpandConfig extends ExpandConfig<TSchemas, TCollectionKey>>(
    expandConfig: NewExpandConfig
  ): IGetOne<TSchemas, TCollectionKey, NewExpandConfig>

  execute(): Promise<
    SingleItemReturnType<TSchemas, TCollectionKey, TExpandConfig, TFields>
  >
}

export interface IGetOneFactory<TSchemas extends CleanedSchemas> {
  collection<TCollectionKey extends CollectionKey<TSchemas>>(
    collectionKey: TCollectionKey
  ): IGetOne<TSchemas, TCollectionKey>
}

// ==================== Create Interface ====================

export type ICreateData<
  TSchemas extends CleanedSchemas,
  TCollectionKey extends CollectionKey<TSchemas>
> = Partial<Record<FieldKey<TSchemas, TCollectionKey>, unknown>>

export interface ICreate<
  TSchemas extends CleanedSchemas,
  TCollectionKey extends CollectionKey<TSchemas>,
  TExpandConfig extends ExpandConfig<TSchemas, TCollectionKey> = Record<
    never,
    never
  >,
  TFields extends FieldSelection<TSchemas, TCollectionKey, TExpandConfig> =
    Record<never, never>
> {
  data(
    data: ICreateData<TSchemas, TCollectionKey>
  ): ICreate<TSchemas, TCollectionKey, TExpandConfig, TFields>

  fields<
    NewFields extends FieldSelection<TSchemas, TCollectionKey, TExpandConfig>
  >(
    fields: NewFields
  ): ICreate<TSchemas, TCollectionKey, TExpandConfig, NewFields>

  expand<NewExpandConfig extends ExpandConfig<TSchemas, TCollectionKey>>(
    expandConfig: NewExpandConfig
  ): ICreate<TSchemas, TCollectionKey, NewExpandConfig>

  execute(): Promise<
    SingleItemReturnType<TSchemas, TCollectionKey, TExpandConfig, TFields>
  >
}

export interface ICreateFactory<TSchemas extends CleanedSchemas> {
  collection<TCollectionKey extends CollectionKey<TSchemas>>(
    collectionKey: TCollectionKey
  ): ICreate<TSchemas, TCollectionKey>
}

// ==================== Update Interface ====================

export type IUpdateData<
  TSchemas extends CleanedSchemas,
  TCollectionKey extends CollectionKey<TSchemas>
> = Partial<
  Record<
    | FieldKey<TSchemas, TCollectionKey>
    | `${FieldKey<TSchemas, TCollectionKey>}${'+' | '-'}`,
    unknown
  >
>

export interface IUpdate<
  TSchemas extends CleanedSchemas,
  TCollectionKey extends CollectionKey<TSchemas>,
  TExpandConfig extends ExpandConfig<TSchemas, TCollectionKey> = Record<
    never,
    never
  >,
  TFields extends FieldSelection<TSchemas, TCollectionKey, TExpandConfig> =
    Record<never, never>
> {
  id(
    recordId: string
  ): IUpdate<TSchemas, TCollectionKey, TExpandConfig, TFields>

  data(
    data: IUpdateData<TSchemas, TCollectionKey>
  ): IUpdate<TSchemas, TCollectionKey, TExpandConfig, TFields>

  fields<
    NewFields extends FieldSelection<TSchemas, TCollectionKey, TExpandConfig>
  >(
    fields: NewFields
  ): IUpdate<TSchemas, TCollectionKey, TExpandConfig, NewFields>

  expand<NewExpandConfig extends ExpandConfig<TSchemas, TCollectionKey>>(
    expandConfig: NewExpandConfig
  ): IUpdate<TSchemas, TCollectionKey, NewExpandConfig>

  execute(): Promise<
    SingleItemReturnType<TSchemas, TCollectionKey, TExpandConfig, TFields>
  >
}

export interface IUpdateFactory<TSchemas extends CleanedSchemas> {
  collection<TCollectionKey extends CollectionKey<TSchemas>>(
    collectionKey: TCollectionKey
  ): IUpdate<TSchemas, TCollectionKey>
}

// ==================== Delete Interface ====================

export interface IDelete<
  TSchemas extends CleanedSchemas,
  TCollectionKey extends CollectionKey<TSchemas>
> {
  id(recordId: string): IDelete<TSchemas, TCollectionKey>

  execute(): Promise<boolean>
}

export interface IDeleteFactory<TSchemas extends CleanedSchemas> {
  collection<TCollectionKey extends CollectionKey<TSchemas>>(
    collectionKey: TCollectionKey
  ): IDelete<TSchemas, TCollectionKey>
}

// ==================== PBService Interface ====================

export default interface IPBService<TSchemas extends CleanedSchemas> {
  instance: PocketBase

  readonly getFullList: IGetFullListFactory<TSchemas>
  readonly getList: IGetListFactory<TSchemas>
  readonly getFirstListItem: IGetFirstListItemFactory<TSchemas>
  readonly getOne: IGetOneFactory<TSchemas>
  readonly create: ICreateFactory<TSchemas>
  readonly update: IUpdateFactory<TSchemas>
  readonly delete: IDeleteFactory<TSchemas>
}

export interface IPBServiceConstructor {
  new <TSchemas extends CleanedSchemas>(
    instance: PocketBase
  ): IPBService<TSchemas>
}
