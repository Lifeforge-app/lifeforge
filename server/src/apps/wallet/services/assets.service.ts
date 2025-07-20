import PocketBase from 'pocketbase'

import { ISchemaWithPB } from 'shared/types/collections'
import { WalletCollectionsSchemas } from 'shared/types/collections'

export const getAllAssets = (
  pb: PocketBase
): Promise<ISchemaWithPB<WalletCollectionsSchemas.IAssetAggregated>[]> =>
  pb
    .collection('wallet__assets_aggregated')
    .getFullList<ISchemaWithPB<WalletCollectionsSchemas.IAssetAggregated>>({
      sort: 'name'
    })

export const createAsset = (
  pb: PocketBase,
  data: Pick<
    WalletCollectionsSchemas.IAsset,
    'name' | 'icon' | 'starting_balance'
  >
): Promise<ISchemaWithPB<WalletCollectionsSchemas.IAsset>> =>
  pb
    .collection('wallet__assets')
    .create<ISchemaWithPB<WalletCollectionsSchemas.IAsset>>(data)

export const updateAsset = (
  pb: PocketBase,
  id: string,
  data: Pick<
    WalletCollectionsSchemas.IAsset,
    'name' | 'icon' | 'starting_balance'
  >
): Promise<ISchemaWithPB<WalletCollectionsSchemas.IAsset>> =>
  pb
    .collection('wallet__assets')
    .update<ISchemaWithPB<WalletCollectionsSchemas.IAsset>>(id, data)

export const deleteAsset = async (
  pb: PocketBase,
  id: string
): Promise<void> => {
  await pb.collection('wallet__assets').delete(id)
}
