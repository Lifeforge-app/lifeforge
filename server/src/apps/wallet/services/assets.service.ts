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

// @ts-expect-error Hmmmmmm
const moment = MomentRange.extendMoment(Moment)

export const getAssetAccumulatedBalance = async (
  pb: PocketBase,
  assetId: string
): Promise<Record<string, number>> => {
  const { starting_balance } = await pb
    .collection('wallet__assets')
    .getOne<
      Pick<ISchemaWithPB<WalletCollectionsSchemas.IAsset>, 'starting_balance'>
    >(assetId, {
      fields: 'starting_balance'
    })

  const allIncomeExpensesTransactions = await pb
    .collection('wallet__transactions')
    .getFullList<
      Pick<
        ISchemaWithPB<WalletCollectionsSchemas.ITransaction>,
        'amount' | 'date' | 'type'
      >
    >({
      filter: `asset = '${assetId}'`,
      sort: '-date',
      fields: 'amount,date,type'
    })

  const allTransferTransactions = await pb
    .collection('wallet__transactions_transfer')
    .getFullList<
      Pick<
        ISchemaWithPB<WalletCollectionsSchemas.ITransactionsTransfer>,
        'from' | 'to'
      > & {
        expand: {
          base_transaction: Pick<
            ISchemaWithPB<WalletCollectionsSchemas.ITransaction>,
            'amount' | 'date'
          >
        }
      }
    >({
      filter: `from = '${assetId}' || to = '${assetId}'`,
      sort: '-base_transaction.date',
      expand: 'base_transaction',
      fields: 'base_transaction.amount,base_transaction.date,from,to'
    })

  let currentBalance = starting_balance

  const accumulatedBalance: Record<string, number> = {}

  const allDateInBetween = moment
    .range(
      moment(
        allIncomeExpensesTransactions[allIncomeExpensesTransactions.length - 1]
          .date
      ),
      moment()
    )
    .by('day')

  for (const date of allDateInBetween) {
    const dateStr = date.format('YYYY-MM-DD')

    accumulatedBalance[dateStr] = parseFloat(currentBalance.toFixed(2))

    const transactionsOnDate = [
      ...allIncomeExpensesTransactions.filter(t =>
        moment(t.date).isSame(date, 'day')
      ),
      ...allTransferTransactions
        .filter(t => moment(t.expand.base_transaction.date).isSame(date, 'day'))
        .map(t => ({
          type: t.from === assetId ? 'expenses' : 'income',
          amount: t.expand.base_transaction.amount
        }))
    ]

    for (const transaction of transactionsOnDate) {
      if (transaction.type === 'expenses') {
        currentBalance += transaction.amount
      } else if (transaction.type === 'income') {
        currentBalance -= transaction.amount
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
