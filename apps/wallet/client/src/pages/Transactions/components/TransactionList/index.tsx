import { useFilteredTransactions } from '@/hooks/useFilteredTransactions'
import { useWalletData } from '@/hooks/useWalletData'
import { EmptyStateScreen, Pagination, Scrollbar } from 'lifeforge-ui'
import { useEffect, useState } from 'react'

import TransactionItem from './components/TransactionItem'

function TransactionList() {
  const { transactionsQuery } = useWalletData()

  const [page, setPage] = useState(1)

  const transactions = useFilteredTransactions(transactionsQuery.data ?? [])

  useEffect(() => {
    setPage(1)
  }, [transactions])

  if (transactions.length === 0) {
    return (
      <EmptyStateScreen
        icon="tabler:filter-off"
        name="results"
        namespace="apps.wallet"
      />
    )
  }

  return (
    <>
      <Pagination
        currentPage={page}
        totalPages={Math.ceil(transactions.length / 25)}
        onPageChange={setPage}
      />
      <Scrollbar>
        <div className="w-full space-y-3">
          {transactions.slice((page - 1) * 25, page * 25).map(transaction => (
            <TransactionItem key={transaction.id} transaction={transaction} />
          ))}
        </div>
      </Scrollbar>
    </>
  )
}

export default TransactionList
