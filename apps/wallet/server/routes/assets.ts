import { forgeController, forgeRouter } from '@functions/routes'
import { SCHEMAS } from '@schema'
import Moment from 'moment'
import MomentRange from 'moment-range'
import z from 'zod'

// @ts-expect-error - MomentRange types are not fully compatible with Moment
const moment = MomentRange.extendMoment(Moment)

const list = forgeController
  .query()
  .description('Get all wallet assets')
  .input({})
  .callback(({ pb }) =>
    pb.getFullList
      .collection('wallet__assets_aggregated')
      .sort(['name'])
      .execute()
  )

const getAssetAccumulatedBalance = forgeController
  .query()
  .description('Get accumulated balance for a wallet asset')
  .input({
    query: z.object({
      id: z.string()
    })
  })
  .existenceCheck('query', {
    id: 'wallet__assets'
  })
  .callback(async ({ pb, query: { id } }) => {
    const { starting_balance } = await pb.getOne
      .collection('wallet__assets')
      .id(id)
      .fields({
        starting_balance: true
      })
      .execute()

    const allIncomeExpensesTransactions = await pb.getFullList
      .collection('wallet__transactions_income_expenses')
      .expand({
        base_transaction: 'wallet__transactions'
      })
      .filter([
        {
          field: 'asset',
          operator: '=',
          value: id
        }
      ])
      .fields({
        type: true,
        'expand.base_transaction.amount': true,
        'expand.base_transaction.date': true
      })
      .execute()

    const allTransferTransactions = await pb.getFullList
      .collection('wallet__transactions_transfer')
      .expand({
        base_transaction: 'wallet__transactions'
      })
      .filter([
        {
          combination: '||',
          filters: [
            {
              field: 'from',
              operator: '=',
              value: id
            },
            {
              field: 'to',
              operator: '=',
              value: id
            }
          ]
        }
      ])
      .fields({
        'expand.base_transaction.amount': true,
        'expand.base_transaction.date': true,
        from: true,
        to: true
      })
      .execute()

    const allTransactions = [
      ...allIncomeExpensesTransactions.map(t => ({
        type: t.type,
        amount: t.expand!.base_transaction!.amount!,
        date: t.expand!.base_transaction!.date!
      })),
      ...allTransferTransactions.map(t => ({
        type: t.from === id ? 'expenses' : 'income',
        amount: t.expand!.base_transaction!.amount!,
        date: t.expand!.base_transaction!.date!
      }))
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    let currentBalance = starting_balance

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
        if (transaction.type === 'expenses') {
          currentBalance -= transaction.amount
        } else if (transaction.type === 'income') {
          currentBalance += transaction.amount
        }
      }
    }

    return accumulatedBalance
  })

const create = forgeController
  .mutation()
  .description('Create a new wallet asset')
  .input({
    body: SCHEMAS.wallet.assets.schema
  })
  .statusCode(201)
  .callback(({ pb, body }) =>
    pb.create.collection('wallet__assets').data(body).execute()
  )

const update = forgeController
  .mutation()
  .description('Update an existing wallet asset')
  .input({
    query: z.object({
      id: z.string()
    }),
    body: SCHEMAS.wallet.assets.schema
  })
  .existenceCheck('query', {
    id: 'wallet__assets'
  })
  .callback(({ pb, query: { id }, body }) =>
    pb.update.collection('wallet__assets').id(id).data(body).execute()
  )

const remove = forgeController
  .mutation()
  .description('Delete a wallet asset')
  .input({
    query: z.object({
      id: z.string()
    })
  })
  .existenceCheck('query', {
    id: 'wallet__assets'
  })
  .statusCode(204)
  .callback(({ pb, query: { id } }) =>
    pb.delete.collection('wallet__assets').id(id).execute()
  )

export default forgeRouter({
  list,
  getAssetAccumulatedBalance,
  create,
  update,
  remove
})
