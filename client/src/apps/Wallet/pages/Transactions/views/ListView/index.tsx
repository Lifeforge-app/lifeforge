import { Scrollbar } from 'lifeforge-ui'
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer'
import List from 'react-virtualized/dist/commonjs/List'

import { useFilteredTransactions } from '@apps/Wallet/hooks/useFilteredTransactions'
import { useWalletData } from '@apps/Wallet/hooks/useWalletData'

import TransactionIncomeExpensesItem from './components/TransactionIncomeExpensesItem'
import TransactionTransferItem from './components/TransactionTransferItem'

const AS = AutoSizer as any

const L = List as any

function ListView() {
  const { transactionsQuery } = useWalletData()

  const transactions = useFilteredTransactions(transactionsQuery.data ?? [])

  return (
    <>
      <Scrollbar>
        <AS>
          {({ height, width }: { height: number; width: number }) => (
            <L
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
                    {transaction &&
                      (transaction.type === 'transfer' ? (
                        <TransactionTransferItem transaction={transaction} />
                      ) : (
                        <TransactionIncomeExpensesItem
                          transaction={transaction}
                        />
                      ))}
                  </div>
                )
              }}
              width={width - 2}
            />
          )}
        </AS>
      </Scrollbar>
    </>
  )
}

export default ListView
