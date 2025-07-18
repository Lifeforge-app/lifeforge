import { WithPB } from '@typescript/pocketbase_interfaces'
import PocketBase from 'pocketbase'

import { WalletCollectionsSchemas } from 'shared/types/collections'

export const getAllLedgers = (
  pb: PocketBase
): Promise<WithPB<WalletCollectionsSchemas.ILedger>[]> =>
  pb
    .collection('wallet__ledgers_aggregated')
    .getFullList<WithPB<WalletCollectionsSchemas.ILedger>>({
      sort: 'name'
    })

export const createLedger = (
  pb: PocketBase,
  data: Omit<WalletCollectionsSchemas.ILedger, 'amount'>
): Promise<WithPB<WalletCollectionsSchemas.ILedger>> =>
  pb
    .collection('wallet__ledgers')
    .create<WithPB<WalletCollectionsSchemas.ILedger>>(data)

export const updateLedger = (
  pb: PocketBase,
  id: string,
  data: Omit<WalletCollectionsSchemas.ILedger, 'amount'>
): Promise<WithPB<WalletCollectionsSchemas.ILedger>> =>
  pb
    .collection('wallet__ledgers')
    .update<WithPB<WalletCollectionsSchemas.ILedger>>(id, data)

export const deleteLedger = async (
  pb: PocketBase,
  id: string
): Promise<void> => {
  await pb.collection('wallet__ledgers').delete(id)
}
