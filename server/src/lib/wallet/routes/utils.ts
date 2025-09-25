import { forgeController, forgeRouter } from '@functions/routes'
import moment from 'moment'
import { z } from 'zod'

const getTypesCount = forgeController
  .query()
  .description('Get wallet transaction types count and accumulation')
  .input({})
  .callback(async ({ pb }) => {
    const types = await pb.getFullList
      .collection('wallet__transaction_types_aggregated')
      .execute()

    const typesCount = types.reduce(
      (acc, cur) => ({
        ...acc,
        [cur.name]: {
          transactionCount: cur.transaction_count,
          accumulatedAmount: cur.accumulated_amount as number
        }
      }),
      {} as Record<
        string,
        { transactionCount: number; accumulatedAmount: number }
      >
    )

    return typesCount
  })

const getIncomeExpensesSummary = forgeController
  .query()
  .description('Get income and expenses summary for a specific month/year')
  .input({
    query: z.object({
      year: z.string().transform(val => parseInt(val)),
      month: z.string().transform(val => parseInt(val))
    })
  })
  .callback(async ({ pb, query: { year, month } }) => {
    const start = moment(`${year}-${month}-01`)
      .startOf('month')
      .format('YYYY-MM-DD')

    const end = moment(`${year}-${month}-01`)
      .endOf('month')
      .format('YYYY-MM-DD')

    const transactions = await pb.getFullList
      .collection('wallet__transactions_income_expenses')
      .expand({
        base_transaction: 'wallet__transactions'
      })
      .fields({
        type: true,
        'expand.base_transaction.date': true,
        'expand.base_transaction.amount': true
      })
      .execute()

    const inThisMonth = transactions.filter(
      transaction =>
        moment(
          moment(transaction.expand!.base_transaction!.date!).format(
            'YYYY-MM-DD'
          )
        ).isSameOrAfter(start) &&
        moment(
          moment(transaction.expand!.base_transaction!.date!).format(
            'YYYY-MM-DD'
          )
        ).isSameOrBefore(end)
    )

    const totalIncome = transactions.reduce((acc, cur) => {
      if (cur.type === 'income') {
        return acc + cur.expand!.base_transaction!.amount!
      }

      return acc
    }, 0)

    const totalExpenses = transactions.reduce((acc, cur) => {
      if (cur.type === 'expenses') {
        return acc + cur.expand!.base_transaction!.amount!
      }

      return acc
    }, 0)

    const monthlyIncome = inThisMonth.reduce((acc, cur) => {
      if (cur.type === 'income') {
        return acc + cur.expand!.base_transaction!.amount!
      }

      return acc
    }, 0)

    const monthlyExpenses = inThisMonth.reduce((acc, cur) => {
      if (cur.type === 'expenses') {
        return acc + cur.expand!.base_transaction!.amount!
      }

      return acc
    }, 0)

    return {
      totalIncome,
      totalExpenses,
      monthlyIncome,
      monthlyExpenses
    }
  })

const getExpensesBreakdown = forgeController
  .query()
  .description('Get expenses breakdown by category for a specific month/year')
  .input({
    query: z.object({
      year: z.string().transform(val => parseInt(val)),
      month: z.string().transform(val => parseInt(val))
    })
  })
  .callback(async ({ pb, query: { year, month } }) => {
    const startDate = moment()
      .year(year)
      .month(month - 1)
      .startOf('month')
      .format('YYYY-MM-DD')

    const endDate = moment()
      .year(year)
      .month(month - 1)
      .endOf('month')
      .format('YYYY-MM-DD')

    const expenses = await pb.getFullList
      .collection('wallet__transactions_income_expenses')
      .expand({
        category: 'wallet__categories',
        base_transaction: 'wallet__transactions'
      })
      .filter([
        {
          field: 'base_transaction.date',
          operator: '>=',
          value: startDate
        },
        {
          field: 'base_transaction.date',
          operator: '<=',
          value: endDate
        },
        {
          field: 'type',
          operator: '=',
          value: 'expenses'
        }
      ])
      .fields({
        'expand.base_transaction.amount': true,
        'expand.base_transaction.date': true,
        'expand.category.id': true
      })
      .execute()

    const spentOnEachCategory: Record<
      string,
      {
        amount: number
        count: number
        percentage: number
      }
    > = {}

    for (const expense of expenses) {
      const categoryId = expense.expand?.category?.id

      if (!categoryId) {
        continue
      }

      if (spentOnEachCategory[categoryId]) {
        spentOnEachCategory[categoryId].amount +=
          expense.expand?.base_transaction?.amount || 0
        spentOnEachCategory[categoryId].count += 1
      } else {
        spentOnEachCategory[categoryId] = {
          amount: expense.expand?.base_transaction?.amount || 0,
          count: 1,
          percentage: 0
        }
      }
    }

    const totalSpent = Object.values(spentOnEachCategory).reduce(
      (acc, { amount }) => acc + amount,
      0
    )

    for (const categoryId in spentOnEachCategory) {
      spentOnEachCategory[categoryId].percentage =
        (spentOnEachCategory[categoryId].amount / totalSpent) * 100
    }

    return spentOnEachCategory
  })

export default forgeRouter({
  getTypesCount,
  getIncomeExpensesSummary,
  getExpensesBreakdown
})
