import PocketBase from 'pocketbase'

import { ISchemaWithPB } from 'shared/types/collections'
import { WishlistCollectionsSchemas } from 'shared/types/collections'

export const checkListExists = async (
  pb: PocketBase,
  id: string
): Promise<boolean> => {
  try {
    await pb.collection('wishlist__lists').getOne(id)
    return true
  } catch (error) {
    return false
  }
}

export const getList = (
  pb: PocketBase,
  id: string
): Promise<ISchemaWithPB<WishlistCollectionsSchemas.IListAggregated>> =>
  pb
    .collection('wishlist__lists_aggregated')
    .getOne<ISchemaWithPB<WishlistCollectionsSchemas.IListAggregated>>(id)

export const getAllLists = (
  pb: PocketBase
): Promise<ISchemaWithPB<WishlistCollectionsSchemas.IListAggregated>[]> =>
  pb
    .collection('wishlist__lists_aggregated')
    .getFullList<ISchemaWithPB<WishlistCollectionsSchemas.IListAggregated>>({
      sort: 'name'
    })

export const createList = (
  pb: PocketBase,
  data: WishlistCollectionsSchemas.IList
): Promise<ISchemaWithPB<WishlistCollectionsSchemas.IList>> =>
  pb
    .collection('wishlist__lists')
    .create<ISchemaWithPB<WishlistCollectionsSchemas.IList>>(data)

export const updateList = async (
  pb: PocketBase,
  id: string,
  data: WishlistCollectionsSchemas.IList
): Promise<ISchemaWithPB<WishlistCollectionsSchemas.IList>> =>
  pb
    .collection('wishlist__lists')
    .update<ISchemaWithPB<WishlistCollectionsSchemas.IList>>(id, data)

export const deleteList = async (pb: PocketBase, id: string): Promise<void> => {
  await pb.collection('wishlist__lists').delete(id)
}
