import {
  CollectionKey,
  ExpandConfig,
  FieldKey,
  FieldSelection,
  FilterType
} from './pb_service'

export interface PBServiceBase<
  TCollectionKey extends CollectionKey,
  TExpandConfig extends ExpandConfig<TCollectionKey> = Record<never, never>
> {
  id?(recordId: string): this

  data?(data: Partial<Record<FieldKey<TCollectionKey>, unknown>>): this

  filter?(filter: FilterType<TCollectionKey, TExpandConfig>): this

  sort?(
    sort: (FieldKey<TCollectionKey> | `-${FieldKey<TCollectionKey>}`)[]
  ): this

  fields?<NewFields extends FieldSelection<TCollectionKey, TExpandConfig>>(
    fields: NewFields
  ): PBServiceBase<TCollectionKey, TExpandConfig>

  expand?<NewExpandConfig extends ExpandConfig<TCollectionKey>>(
    expandConfig: NewExpandConfig
  ): PBServiceBase<TCollectionKey, NewExpandConfig>

  execute(): Promise<unknown>
}
