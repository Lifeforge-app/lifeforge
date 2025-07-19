import PocketBase from 'pocketbase'

import { ISchemaWithPB } from 'shared/types/collections'
import { WalletCollectionsSchemas } from 'shared/types/collections'

export const getAllCategories = (
  pb: PocketBase
): Promise<ISchemaWithPB<WalletCollectionsSchemas.ICategoryAggregated>[]> =>
  pb
    .collection('wallet__categories_aggregated')
    .getFullList<ISchemaWithPB<WalletCollectionsSchemas.ICategoryAggregated>>({
      sort: 'name'
    })

export const createCategory = (
  pb: PocketBase,
  data: Omit<WalletCollectionsSchemas.ICategory, 'amount'>
): Promise<ISchemaWithPB<WalletCollectionsSchemas.ICategory>> =>
  pb
    .collection('wallet__categories')
    .create<ISchemaWithPB<WalletCollectionsSchemas.ICategory>>(data)

export const updateCategory = (
  pb: PocketBase,
  id: string,
  data: Omit<WalletCollectionsSchemas.ICategory, 'amount'>
): Promise<ISchemaWithPB<WalletCollectionsSchemas.ICategory>> =>
  pb
    .collection('wallet__categories')
    .update<ISchemaWithPB<WalletCollectionsSchemas.ICategory>>(id, data)

export const deleteCategory = async (
  pb: PocketBase,
  id: string
): Promise<void> => {
  await pb.collection('wallet__categories').delete(id)
}
