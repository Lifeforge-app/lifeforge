import moment from 'moment'
import Pocketbase from 'pocketbase'

import { ISchemaWithPB } from 'shared/types/collections'
import { WalletCollectionsSchemas } from 'shared/types/collections'
export const getTypesCount = async (
  pb: Pocketbase
): Promise<WalletControllersSchemas.IUtils['getTypesCount']['response']> => {
  const types = await pb
    .collection('wallet__transaction_types_aggregated')
    .getFullList<
      ISchemaWithPB<WalletCollectionsSchemas.ITransactionTypeAggregated>
    >()

  const typesCount = types.reduce(
    (acc, cur) => ({
      ...acc,
      [cur.name]: {
        transactionCount: cur.transaction_count,
        accumulatedAmount: cur.accumulated_amount
      }
    }),
    {}
  )

  return typesCount
}

export const getIncomeExpensesSummary = async (
  pb: Pocketbase,
  year: string,
  month: string
): Promise<WalletCollectionsSchemas.IWalletIncomeExpensesSummary> => {
  const start = moment(`${year}-${month}-01`)
    .startOf('month')
    .format('YYYY-MM-DD')

  const end = moment(`${year}-${month}-01`).endOf('month').format('YYYY-MM-DD')

  const transactions = await pb
    .collection('wallet__transactions_income_expenses')
    .getFullList<
      Pick<
        ISchemaWithPB<WalletCollectionsSchemas.ITransactionsIncomeExpense>,
        'type'
      > & {
        expand: {
          base_transaction: Pick<
            ISchemaWithPB<WalletCollectionsSchemas.ITransaction>,
            'amount' | 'date'
          >
        }
      }
    >({
      filter: "type = 'income' || type = 'expenses'",
      fields:
        'expand.base_transaction.amount,expand.base_transaction.date,type',
      expand: 'base_transaction'
    })

  const inThisMonth = transactions.filter(
    transaction =>
      moment(
        moment(transaction.expand.base_transaction.date).format('YYYY-MM-DD')
      ).isSameOrAfter(start) &&
      moment(
        moment(transaction.expand.base_transaction.date).format('YYYY-MM-DD')
      ).isSameOrBefore(end)
  )

  const totalIncome = transactions.reduce((acc, cur) => {
    if (cur.type === 'income') {
      return acc + cur.expand.base_transaction.amount
    }

    return acc
  }, 0)

  const totalExpenses = transactions.reduce((acc, cur) => {
    if (cur.type === 'expenses') {
      return acc + cur.expand.base_transaction.amount
    }

    return acc
  }, 0)

  const monthlyIncome = inThisMonth.reduce((acc, cur) => {
    if (cur.type === 'income') {
      return acc + cur.expand.base_transaction.amount
    }

    return acc
  }, 0)

  const monthlyExpenses = inThisMonth.reduce((acc, cur) => {
    if (cur.type === 'expenses') {
      return acc + cur.expand.base_transaction.amount
    }

    return acc
  }, 0)

  return {
    totalIncome,
    totalExpenses,
    monthlyIncome,
    monthlyExpenses
  }
}

export const getExpensesBreakdown = async (
  pb: Pocketbase,
  year: number,
  month: number
): Promise<
  Record<
    string,
    {
      amount: number
      count: number
      percentage: number
    }
  >
> => {
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

  const expenses = await pb
    .collection('wallet__transactions_income_expenses')
    .getFullList<
      ISchemaWithPB<WalletCollectionsSchemas.ITransactionsIncomeExpense> & {
        expand: {
          category: ISchemaWithPB<WalletCollectionsSchemas.ICategory>
          base_transaction: ISchemaWithPB<WalletCollectionsSchemas.ITransaction>
        }
      }
    >({
      filter: `base_transaction.date >= '${startDate}' && base_transaction.date <= '${endDate}' && type = 'expenses'`,
      expand: 'category,base_transaction'
    })

  const spentOnEachCategory
    {}

  for (const expense of expenses) {
    const categoryId = expense.expand?.category.id

    if (!categoryId) {
      continue
    }

    if (spentOnEachCategory[categoryId]) {
      spentOnEachCategory[categoryId].amount +=
        expense.expand.base_transaction.amount
      spentOnEachCategory[categoryId].count += 1
    } else {
      spentOnEachCategory[categoryId] = {
        amount: expense.expand.base_transaction.amount,
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
}
