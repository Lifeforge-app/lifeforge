import { EmptyStateScreen, Pagination, Scrollbar, Stack } from '@lifeforge/ui'

import useFilter from '@/hooks/useFilter'
import { useFilteredTransactions } from '@/hooks/useFilteredTransactions'
import { useWalletData } from '@/hooks/useWalletData'

import TransactionItem from './components/TransactionItem'

function TransactionList() {
  const { transactionsQuery } = useWalletData()
  const filters = useFilter()

  const {
    page,
    setPage,
    type,
    category,
    asset,
    ledger,
    startDate,
    endDate,
    searchQuery
  } = filters

  const transactions = useFilteredTransactions(transactionsQuery.data ?? [], {
    type,
    category,
    asset,
    ledger,
    startDate,
    endDate,
    searchQuery
  })

  if (transactions.length === 0) {
    return (
      <EmptyStateScreen
        icon="tabler:filter-off"
        message={{
          id: 'results'
        }}
      />
    )
  }

  return (
    <>
      <Pagination
        page={page}
        totalPages={Math.ceil(transactions.length / 25)}
        onPageChange={setPage}
      />
      <Scrollbar>
        <Stack>
          {transactions.slice((page - 1) * 25, page * 25).map(transaction => (
            <TransactionItem key={transaction.id} transaction={transaction} />
          ))}
        </Stack>
      </Scrollbar>
    </>
  )
}

export default TransactionList
