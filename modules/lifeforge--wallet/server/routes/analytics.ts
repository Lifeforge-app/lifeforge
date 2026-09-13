import dayjs from 'dayjs'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import z from 'zod'

import forge from '../forge'
import walletSchemas from '../schema'

dayjs.extend(isSameOrBefore)
dayjs.extend(isSameOrAfter)

const TypesCountOutput = z.record(
  z.string(),
  z.object({
    transactionCount: z.number(),
    accumulatedAmount: z.number()
  })
)

const IncomeExpensesSummaryOutput = z.object({
  totalIncome: z.number(),
  totalExpenses: z.number(),
  monthlyIncome: z.number(),
  monthlyExpenses: z.number()
})

const CategoryBreakdownItem = z.object({
  amount: z.number(),
  count: z.number(),
  percentage: z.number()
})

const CategoryBreakdownOutput = z.object({
  income: z.record(z.string(), CategoryBreakdownItem),
  expenses: z.record(z.string(), CategoryBreakdownItem)
})

const AvailableYearMonthsOutput = z.object({
  years: z.array(z.number()),
  monthsByYear: z.record(z.string(), z.array(z.number()))
})

const TransactionCountByDayOutput = z.record(
  z.string(),
  z.object({
    income: z.number(),
    expenses: z.number(),
    transfer: z.number(),
    total: z.number(),
    count: z.number()
  })
)

const ChartDataOutput = z.array(
  z.object({
    date: z.string(),
    income: z.number(),
    expenses: z.number()
  })
)

export const getTypesCount = forge
  .query({
    description: 'Get transaction counts and totals by type',
    input: {
      query: z.object({
        year: z.string().optional(),
        month: z.string().optional()
      })
    },
    output: {
      OK: TypesCountOutput
    }
  })
  .callback(async ({ pb, query: { year, month }, response }) => {
    const parsedYear = year ? parseInt(year) : undefined

    const parsedMonth = month ? parseInt(month) : undefined

    if (parsedYear !== undefined && parsedMonth !== undefined) {
      const data = await pb.getFullList
        .collection('transactions_amount_aggregated')
        .filter([
          { field: 'year', operator: '=', value: year },
          { field: 'month', operator: '=', value: month }
        ])
        .execute()

      const typesCount: Record<
        string,
        { transactionCount: number; accumulatedAmount: number }
      > = {
        income: { transactionCount: 0, accumulatedAmount: 0 },
        expenses: { transactionCount: 0, accumulatedAmount: 0 },
        transfer: { transactionCount: 0, accumulatedAmount: 0 }
      }

      for (const row of data) {
        typesCount.income.transactionCount += row.income_count || 0
        typesCount.income.accumulatedAmount += row.income || 0
        typesCount.expenses.transactionCount += row.expenses_count || 0
        typesCount.expenses.accumulatedAmount += row.expenses || 0
        typesCount.transfer.transactionCount += row.transfer_count || 0
        typesCount.transfer.accumulatedAmount += row.transfer || 0
      }

      return response.ok(typesCount)
    }

    const types = await pb.getFullList
      .collection('transaction_types_aggregated')
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

    return response.ok(typesCount)
  })

export const getIncomeExpensesSummary = forge
  .query({
    description: 'Get income and expenses summary for a month',
    input: {
      query: z.object({
        year: z.string(),
        month: z.string()
      })
    },
    output: {
      OK: IncomeExpensesSummaryOutput
    }
  })
  .callback(async ({ pb, query: { year, month }, response }) => {
    const parsedYear = parseInt(year)

    const parsedMonth = parseInt(month)

    const start = dayjs(`${parsedYear}-${parsedMonth}-01`)
      .startOf('month')
      .format('YYYY-MM-DD')

    const end = dayjs(`${parsedYear}-${parsedMonth}-01`)
      .endOf('month')
      .format('YYYY-MM-DD')

    const transactions = await pb.getFullList
      .collection('transactions_income_expenses')
      .expand({ base_transaction: 'transactions' })
      .fields({
        type: true,
        'expand.base_transaction.date': true,
        'expand.base_transaction.amount': true
      })
      .execute()

    const inThisMonth = transactions.filter(
      transaction =>
        dayjs(
          dayjs(transaction.expand!.base_transaction!.date!).format(
            'YYYY-MM-DD'
          )
        ).isSameOrAfter(start) &&
        dayjs(
          dayjs(transaction.expand!.base_transaction!.date!).format(
            'YYYY-MM-DD'
          )
        ).isSameOrBefore(end)
    )

    const totalIncome = transactions.reduce((acc, cur) => {
      if (cur.type === 'income')
        return acc + cur.expand!.base_transaction!.amount!

      return acc
    }, 0)

    const totalExpenses = transactions.reduce((acc, cur) => {
      if (cur.type === 'expenses')
        return acc + cur.expand!.base_transaction!.amount!

      return acc
    }, 0)

    const monthlyIncome = inThisMonth.reduce((acc, cur) => {
      if (cur.type === 'income')
        return acc + cur.expand!.base_transaction!.amount!

      return acc
    }, 0)

    const monthlyExpenses = inThisMonth.reduce((acc, cur) => {
      if (cur.type === 'expenses')
        return acc + cur.expand!.base_transaction!.amount!

      return acc
    }, 0)

    return response.ok({
      totalIncome,
      totalExpenses,
      monthlyIncome,
      monthlyExpenses
    })
  })

export const getCategoriesBreakdown = forge
  .query({
    description: 'Get income and expenses breakdown by category for a month',
    input: {
      query: z.object({
        year: z.string(),
        month: z.string()
      })
    },
    output: {
      OK: CategoryBreakdownOutput
    }
  })
  .callback(async ({ pb, query: { year, month }, response }) => {
    const parsedYear = parseInt(year)

    const parsedMonth = parseInt(month)

    const startDate = dayjs()
      .year(parsedYear)
      .month(parsedMonth - 1)
      .startOf('month')
      .format('YYYY-MM-DD')

    const endDate = dayjs()
      .year(parsedYear)
      .month(parsedMonth - 1)
      .endOf('month')
      .format('YYYY-MM-DD')

    const transactions = await pb.getFullList
      .collection('transactions_income_expenses')
      .expand({ category: 'categories', base_transaction: 'transactions' })
      .filter([
        { field: 'base_transaction.date', operator: '>=', value: startDate },
        { field: 'base_transaction.date', operator: '<=', value: endDate }
      ])
      .fields({
        type: true,
        'expand.base_transaction.amount': true,
        'expand.base_transaction.date': true,
        'expand.category.id': true
      })
      .execute()

    const incomeByCategory: Record<
      string,
      { amount: number; count: number; percentage: number }
    > = {}

    const expensesByCategory: Record<
      string,
      { amount: number; count: number; percentage: number }
    > = {}

    for (const transaction of transactions) {
      const categoryId = transaction.expand?.category?.id

      const amount = transaction.expand?.base_transaction?.amount || 0

      const type = transaction.type

      if (!categoryId) continue

      const targetMap =
        type === 'income' ? incomeByCategory : expensesByCategory

      if (targetMap[categoryId]) {
        targetMap[categoryId].amount += amount
        targetMap[categoryId].count += 1
      } else {
        targetMap[categoryId] = { amount, count: 1, percentage: 0 }
      }
    }

    const totalIncome = Object.values(incomeByCategory).reduce(
      (acc, { amount }) => acc + amount,
      0
    )

    for (const categoryId in incomeByCategory) {
      incomeByCategory[categoryId].percentage =
        totalIncome > 0
          ? (incomeByCategory[categoryId].amount / totalIncome) * 100
          : 0
    }

    const totalExpenses = Object.values(expensesByCategory).reduce(
      (acc, { amount }) => acc + amount,
      0
    )

    for (const categoryId in expensesByCategory) {
      expensesByCategory[categoryId].percentage =
        totalExpenses > 0
          ? (expensesByCategory[categoryId].amount / totalExpenses) * 100
          : 0
    }

    return response.ok({
      income: incomeByCategory,
      expenses: expensesByCategory
    })
  })

export const getSpendingByLocation = forge
  .query({
    description: 'Get spending aggregated by location for heatmap',
    output: {
      OK: z.array(
        walletSchemas.expenses_location_aggregated.extend({
          lng: z.number(),
          lat: z.number(),
          amount: z.number()
        })
      )
    }
  })
  .callback(async ({ pb, response }) =>
    response.ok(
      await pb.getFullList.collection('expenses_location_aggregated').execute()
    )
  )

export const getAvailableYearMonths = forge
  .query({
    description: 'Get available years and months from transaction dates',
    output: {
      OK: AvailableYearMonthsOutput
    }
  })
  .callback(async ({ pb, response }) => {
    const transactions = await pb.getFullList
      .collection('transactions')
      .fields({ date: true })
      .execute()

    const yearMonthMap: Record<number, Set<number>> = {}

    for (const transaction of transactions) {
      const date = dayjs(transaction.date)

      const year = date.year()

      const month = date.month()

      if (!yearMonthMap[year]) {
        yearMonthMap[year] = new Set()
      }
      yearMonthMap[year].add(month)
    }

    const years = Object.keys(yearMonthMap)
      .map(Number)
      .sort((a, b) => b - a)

    const monthsByYear: Record<number, number[]> = {}

    for (const year of years) {
      monthsByYear[year] = Array.from(yearMonthMap[year]).sort((a, b) => b - a)
    }

    return response.ok({ years, monthsByYear })
  })

export const getTransactionCountByDay = forge
  .query({
    description: 'Get transaction counts by day for a specific month',
    input: {
      query: z.object({
        year: z.string(),
        month: z.string(),
        viewFilter: z.string().optional()
      })
    },
    output: {
      OK: TransactionCountByDayOutput
    }
  })
  .callback(async ({ pb, query: { year, month, viewFilter }, response }) => {
    const parsedYear = parseInt(year)

    const parsedMonth = parseInt(month) + 1

    const parsedViewFilter: ('income' | 'expenses' | 'transfer')[] = (viewFilter
      ?.split(',')
      .map(v => v.trim())
      .filter(t => ['income', 'expenses', 'transfer'].includes(t)) as (
      'income' | 'expenses' | 'transfer'
    )[]) ?? ['income', 'expenses', 'transfer']

    const data = await pb.getFullList
      .collection('transactions_amount_aggregated')
      .filter([
        { field: 'year', operator: '=', value: parsedYear },
        { field: 'month', operator: '=', value: parsedMonth }
      ])
      .execute()

    const countMap: Record<
      string,
      {
        income: number
        expenses: number
        transfer: number
        total: number
        count: number
      }
    > = {}

    for (const row of data) {
      const dateKey = `${row.year}-${row.month}-${row.date}`

      countMap[dateKey] = {
        income: 0,
        expenses: 0,
        transfer: 0,
        total: 0,
        count: 0
      }

      const types = ['income', 'expenses', 'transfer'] as const

      for (const type of types) {
        if (parsedViewFilter.includes(type)) {
          const count = row[`${type}_count`] || 0

          countMap[dateKey][type] = count
          countMap[dateKey].total += count
          countMap[dateKey].count += count > 0 ? count : 0
        }
      }
    }

    return response.ok(countMap)
  })

export const getChartData = forge
  .query({
    description: 'Get chart data for income/expenses by date range',
    input: {
      query: z.object({
        range: z.enum(['week', 'month', 'ytd'])
      })
    },
    output: {
      OK: ChartDataOutput
    }
  })
  .callback(async ({ pb, query: { range }, response }) => {
    const now = dayjs()

    const currentYear = now.year()

    let startDate: string
    let endDate: string
    let groupBy: 'day' | 'month'

    const labels: string[] = []

    switch (range) {
      case 'week': {
        const startOfWeek = dayjs().startOf('week')

        startDate = startOfWeek.format('YYYY-MM-DD')
        endDate = dayjs().endOf('week').format('YYYY-MM-DD')
        groupBy = 'day'

        for (let i = 0; i <= 6; i++) {
          labels.push(startOfWeek.clone().add(i, 'day').format('MMM DD'))
        }
        break
      }

      case 'month': {
        const startOfMonth = dayjs().startOf('month')

        const endOfMonth = dayjs().endOf('month')

        startDate = startOfMonth.format('YYYY-MM-DD')
        endDate = endOfMonth.format('YYYY-MM-DD')
        groupBy = 'day'

        for (let i = 0; i < endOfMonth.date(); i++) {
          labels.push(startOfMonth.clone().add(i, 'day').format('MMM DD'))
        }
        break
      }

      case 'ytd': {
        startDate = dayjs().startOf('year').format('YYYY-MM-DD')
        endDate = dayjs().endOf('month').format('YYYY-MM-DD')
        groupBy = 'month'

        for (let i = 0; i <= now.month(); i++) {
          labels.push(dayjs().month(i).format('MMM'))
        }
        break
      }
    }

    const transactions = await pb.getFullList
      .collection('transactions_income_expenses')
      .expand({ base_transaction: 'transactions' })
      .filter([
        { field: 'base_transaction.date', operator: '>=', value: startDate },
        { field: 'base_transaction.date', operator: '<=', value: endDate }
      ])
      .execute()

    const resultMap: Record<string, { income: number; expenses: number }> = {}

    for (const label of labels) {
      resultMap[label] = { income: 0, expenses: 0 }
    }

    for (const transaction of transactions) {
      const base = transaction.expand?.base_transaction

      if (!base) continue

      const transactionYear = dayjs(base.date).year()

      if (transactionYear !== currentYear) continue

      let dateKey: string

      if (groupBy === 'day') {
        dateKey = dayjs(base.date).format('MMM DD')
      } else {
        dateKey = dayjs(base.date).format('MMM')
      }

      if (resultMap[dateKey]) {
        if (transaction.type === 'income') {
          resultMap[dateKey].income += base.amount
        } else if (transaction.type === 'expenses') {
          resultMap[dateKey].expenses += base.amount
        }
      }
    }

    return response.ok(
      labels.map(date => ({
        date,
        income: resultMap[date].income,
        expenses: resultMap[date].expenses > 0 ? -resultMap[date].expenses : 0
      }))
    )
  })
