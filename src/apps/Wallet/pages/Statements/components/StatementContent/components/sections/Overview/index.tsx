import dayjs from 'dayjs'
import { useMemo } from 'react'

import { useWalletData } from '@apps/Wallet/hooks/useWalletData'

import AssetsTable from './components/AssetsTable'
import IncomeExpensesTable from './components/IncomeExpensesTable'
import OverviewSummary from './components/OverviewSummary'

function Overview({ month, year }: { month: number; year: number }) {
  const { transactionsQuery } = useWalletData()
  const transactions = transactionsQuery.data ?? []
  const filteredTransactions = useMemo(() => {
    if (typeof transactions === 'string') return []

    return transactions.filter(
      transaction =>
        dayjs(transaction.date).month() === month &&
        dayjs(transaction.date).year() === year
    )
  }, [transactions, month, year])

  return (
    <>
      <h2 className="mt-16 text-3xl font-semibold tracking-widest uppercase">
        <span className="text-custom-500 print:text-lime-600">01. </span>
        Overview
      </h2>
      <OverviewSummary filteredTransactions={filteredTransactions} />
      <h2 className="mt-16 text-2xl font-semibold tracking-widest uppercase">
        <span>1.1 </span>
        Assets
      </h2>
      <AssetsTable month={month} year={year} />
      {(['income', 'expenses'] as const).map(type => (
        <IncomeExpensesTable key={type} month={month} type={type} year={year} />
      ))}
    </>
  )
}

export default Overview
