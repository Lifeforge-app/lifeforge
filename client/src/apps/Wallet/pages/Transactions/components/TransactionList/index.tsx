import { EmptyStateScreen, Scrollbar } from 'lifeforge-ui'
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer'
import List from 'react-virtualized/dist/commonjs/List'

import { useFilteredTransactions } from '@apps/Wallet/hooks/useFilteredTransactions'
import { useWalletData } from '@apps/Wallet/hooks/useWalletData'

import TransactionItem from './components/TransactionItem'

function TransactionList() {
  const { transactionsQuery } = useWalletData()

  const transactions = useFilteredTransactions(transactionsQuery.data ?? [])

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
      <Scrollbar>
        <AutoSizer>
          {({ height, width }: { height: number; width: number }) => (
            <List
              height={height}
              rowCount={transactions.length + 1}
              rowHeight={80}
              rowRenderer={({
                index,
                key,
                style
              }: {
                index: number
                key: string
                style: React.CSSProperties
              }) => {
                const transaction =
                  index === transactions.length ? null : transactions[index]

                return (
                  <div key={key} style={style}>
                    {transaction && (
                      <TransactionItem transaction={transaction} />
                    )}
                  </div>
                )
              }}
              width={width - 2}
            />
          )}
        </AutoSizer>
      </Scrollbar>
    </>
  )
}

export default TransactionList
