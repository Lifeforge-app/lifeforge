import Moment from 'moment'
import MomentRange from 'moment-range'
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

// @ts-ignore
const moment = MomentRange.extendMoment(Moment)

export const getAssetAccumulatedBalance = async (
  pb: PocketBase,
  assetId: string
): Promise<Record<string, number>> => {
  const asset = await pb
    .collection('wallet__assets')
    .getOne<
      Pick<ISchemaWithPB<WalletCollectionsSchemas.IAsset>, 'starting_balance'>
    >(assetId, {
      fields: 'starting_balance'
    })

  const allTransactions = await pb
    .collection('wallet__transactions')
    .getFullList<
      Pick<
        ISchemaWithPB<WalletCollectionsSchemas.ITransaction>,
        'amount' | 'date' | 'side'
      >
    >({
      filter: `asset = '${assetId}'`,
      sort: '-date',
      fields: 'amount,date,side'
    })

  let currentBalance = asset.starting_balance

  const accumulatedBalance: Record<string, number> = {}

  const allDateInBetween = moment
    .range(moment(allTransactions[allTransactions.length - 1].date), moment())
    .by('day')

  for (const date of allDateInBetween) {
    const dateStr = date.format('YYYY-MM-DD')

    accumulatedBalance[dateStr] = parseFloat(currentBalance.toFixed(2))

    const transactionsOnDate = allTransactions.filter(t =>
      moment(t.date).isSame(date, 'day')
    )

    for (const transaction of transactionsOnDate) {
      if (transaction.side) {
        if (transaction.side === 'debit') {
          currentBalance += transaction.amount
        } else if (transaction.side === 'credit') {
          currentBalance -= transaction.amount
        }
      }
    }
  }

  return accumulatedBalance
}

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
