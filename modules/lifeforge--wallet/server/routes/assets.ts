import dayjs from 'dayjs'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import Moment from 'moment'
import MomentRange from 'moment-range'
import z from 'zod'

import forge from '../forge'
import walletSchemas from '../schema'
import getDateRange from '../utils/getDateRange'

// @ts-expect-error - MomentRange types are not fully compatible with Moment
const moment = MomentRange.extendMoment(Moment)

dayjs.extend(isSameOrBefore)
dayjs.extend(isSameOrAfter)

export const list = forge
  .query({
    description: 'Get all wallet assets',
    output: {
      OK: z.array(
        walletSchemas.assets_aggregated.extend({
          current_balance: z.number()
        })
      )
    }
  })
  .callback(async ({ pb, response }) =>
    response.ok(
      await pb.getFullList
        .collection('assets_aggregated')
        .sort(['name'])
        .execute()
    )
  )

export const getAssetAccumulatedBalance = forge
  .query({
    description: 'Get asset balance over time',
    input: {
      query: z.object({
        id: z.string(),
        rangeMode: z.enum([
          'week',
          'month',
          'year',
          'all',
          'custom',
          'quarter'
        ]),
        startDate: z.string().optional(),
        endDate: z.string().optional()
      })
    },
    existenceCheck: {
      query: {
        id: 'assets'
      }
    },
    output: {
      OK: z.object({
        balances: z.record(z.string(), z.number()),
        startBalance: z.number(),
        endBalance: z.number()
      }),
      NOT_FOUND: true
    }
  })
  .callback(
    async ({ pb, query: { id, rangeMode, startDate, endDate }, response }) => {
      const dateRange = getDateRange(rangeMode, startDate, endDate)

      const { starting_balance } = await pb.getOne
        .collection('assets')
        .id(id)
        .fields({
          starting_balance: true
        })
        .execute()

      const allIncomeExpensesTransactions = await pb.getFullList
        .collection('transactions_income_expenses')
        .expand({
          base_transaction: 'transactions'
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
        .collection('transactions_transfer')
        .expand({
          base_transaction: 'transactions'
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

      if (allTransactions.length === 0) {
        return response.ok({
          balances: {},
          startBalance: starting_balance,
          endBalance: starting_balance
        })
      }

      let currentBalance = starting_balance

      const accumulatedBalance: Record<string, number> = {}

      const allDateInBetween = moment
        .range(
          moment(allTransactions[allTransactions.length - 1].date),
          moment()
        )
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

      const filtered = Object.fromEntries(
        Object.entries(accumulatedBalance).filter(([date]) => {
          const dateMoment = moment(date)

          const isAfterStartDate = dateRange.startDate
            ? dateMoment.isSameOrAfter(moment(dateRange.startDate), 'day')
            : true

          const isBeforeEndDate = dateRange.endDate
            ? dateMoment.isSameOrBefore(moment(dateRange.endDate), 'day')
            : true

          return isAfterStartDate && isBeforeEndDate
        })
      )

      const balances = Object.values(filtered)

      return response.ok({
        balances: filtered,
        startBalance: balances.length > 0 ? balances[0] : starting_balance,
        endBalance:
          balances.length > 0 ? balances[balances.length - 1] : starting_balance
      })
    }
  )

export const getAllAssetAccumulatedBalance = forge
  .query({
    description: 'Get all asset balances for a specific month',
    input: {
      query: z.object({
        year: z.string(),
        month: z.string()
      })
    },
    output: {
      OK: z.record(
        z.string(),
        z.object({
          last: z.number(),
          current: z.number()
        })
      )
    }
  })
  .callback(async ({ pb, query: { year, month }, response }) => {
    const parsedYear = parseInt(year)

    const parsedMonth = parseInt(month)

    const currentMonthEnd = dayjs()
      .year(parsedYear)
      .month(parsedMonth - 1)
      .endOf('month')

    const prevMonthEnd = dayjs()
      .year(parsedYear)
      .month(parsedMonth - 1)
      .startOf('month')
      .subtract(1, 'day')

    const assets = await pb.getFullList
      .collection('assets')
      .fields({
        id: true,
        starting_balance: true
      })
      .execute()

    const allIncomeExpensesTransactions = await pb.getFullList
      .collection('transactions_income_expenses')
      .expand({
        base_transaction: 'transactions'
      })
      .fields({
        type: true,
        asset: true,
        'expand.base_transaction.amount': true,
        'expand.base_transaction.date': true
      })
      .execute()

    const allTransferTransactions = await pb.getFullList
      .collection('transactions_transfer')
      .expand({
        base_transaction: 'transactions'
      })
      .fields({
        'expand.base_transaction.amount': true,
        'expand.base_transaction.date': true,
        from: true,
        to: true
      })
      .execute()

    const result: Record<string, { last: number; current: number }> = {}

    for (const asset of assets) {
      const incomeExpenses = allIncomeExpensesTransactions
        .filter(t => t.asset === asset.id)
        .map(t => ({
          type: t.type as 'income' | 'expenses',
          amount: t.expand!.base_transaction!.amount!,
          date: t.expand!.base_transaction!.date!
        }))

      const transfers = allTransferTransactions
        .filter(t => t.from === asset.id || t.to === asset.id)
        .map(t => ({
          type: (t.from === asset.id ? 'expenses' : 'income') as
            'income' | 'expenses',
          amount: t.expand!.base_transaction!.amount!,
          date: t.expand!.base_transaction!.date!
        }))

      const allTransactions = [...incomeExpenses, ...transfers].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      )

      let balance = asset.starting_balance
      let lastMonthBalance = asset.starting_balance
      let currentMonthBalance = asset.starting_balance

      for (const transaction of allTransactions) {
        const txDate = dayjs(transaction.date)

        if (transaction.type === 'income') {
          balance += transaction.amount
        } else {
          balance -= transaction.amount
        }

        if (txDate.isSameOrBefore(prevMonthEnd, 'day')) {
          lastMonthBalance = balance
        }

        if (txDate.isSameOrBefore(currentMonthEnd, 'day')) {
          currentMonthBalance = balance
        }
      }

      result[asset.id] = {
        last: parseFloat(lastMonthBalance.toFixed(2)),
        current: parseFloat(currentMonthBalance.toFixed(2))
      }
    }

    return response.ok(result)
  })

export const create = forge
  .mutation({
    description: 'Create a new wallet asset',
    input: {
      body: walletSchemas.assets.pick({
        name: true,
        icon: true,
        starting_balance: true
      })
    },
    output: {
      CREATED: walletSchemas.assets
    }
  })
  .callback(async ({ pb, body, response }) =>
    response.created(await pb.create.collection('assets').data(body).execute())
  )

export const update = forge
  .mutation({
    description: 'Update asset details',
    input: {
      query: z.object({
        id: z.string()
      }),
      body: walletSchemas.assets.pick({
        name: true,
        icon: true,
        starting_balance: true
      })
    },
    existenceCheck: {
      query: {
        id: 'assets'
      }
    },
    output: {
      OK: walletSchemas.assets,
      NOT_FOUND: true
    }
  })
  .callback(async ({ pb, query: { id }, body, response }) =>
    response.ok(
      await pb.update.collection('assets').id(id).data(body).execute()
    )
  )

export const remove = forge
  .mutation({
    description: 'Delete a wallet asset',
    input: {
      query: z.object({
        id: z.string()
      })
    },
    existenceCheck: {
      query: {
        id: 'assets'
      }
    },
    output: {
      NO_CONTENT: true,
      NOT_FOUND: true
    }
  })
  .callback(async ({ pb, query: { id }, response }) => {
    await pb.delete.collection('assets').id(id).execute()

    return response.noContent()
  })
