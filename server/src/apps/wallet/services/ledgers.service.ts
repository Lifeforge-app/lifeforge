import PocketBase from 'pocketbase'

import { ISchemaWithPB } from 'shared/types/collections'
import { WalletCollectionsSchemas } from 'shared/types/collections'

export const getAllLedgers = (
  pb: PocketBase
): Promise<ISchemaWithPB<WalletCollectionsSchemas.ILedgerAggregated>[]> =>
  pb
    .collection('wallet__ledgers_aggregated')
    .getFullList<ISchemaWithPB<WalletCollectionsSchemas.ILedgerAggregated>>({
      sort: 'name'
    })

export const createLedger = (
  pb: PocketBase,
  data: Omit<WalletCollectionsSchemas.ILedger, 'amount'>
): Promise<ISchemaWithPB<WalletCollectionsSchemas.ILedger>> =>
  pb
    .collection('wallet__ledgers')
    .create<ISchemaWithPB<WalletCollectionsSchemas.ILedger>>(data)

export const updateLedger = (
  pb: PocketBase,
  id: string,
  data: Omit<WalletCollectionsSchemas.ILedger, 'amount'>
): Promise<ISchemaWithPB<WalletCollectionsSchemas.ILedger>> =>
  pb
    .collection('wallet__ledgers')
    .update<ISchemaWithPB<WalletCollectionsSchemas.ILedger>>(id, data)

export const deleteLedger = async (
  pb: PocketBase,
  id: string
): Promise<void> => {
  await pb.collection('wallet__ledgers').delete(id)
}
