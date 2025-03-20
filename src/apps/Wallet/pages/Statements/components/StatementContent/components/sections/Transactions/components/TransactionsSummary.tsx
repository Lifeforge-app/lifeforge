import dayjs from 'dayjs'

import { useWalletContext } from '@apps/Wallet/providers/WalletProvider'

function TransactionsSummary({ month, year }: { month: number; year: number }) {
  const { transactionsQuery } = useWalletContext()
  const transactions = transactionsQuery.data ?? []

  return (
    <div className="mt-6 flex w-full flex-col">
      <div className="flex items-center justify-between p-3">
        <p className="text-xl">Income</p>
        <p className="text-lg">
          {
            transactions.filter(
              transaction =>
                transaction.type === 'income' &&
                dayjs(transaction.date).month() === month &&
                dayjs(transaction.date).year() === year
            ).length
          }{' '}
          entries
        </p>
      </div>
      <div className="flex items-center justify-between p-3 print:bg-black/[3%]">
        <p className="text-xl">Expenses</p>
        <p className="text-lg">
          {
            transactions.filter(
              transaction =>
                transaction.type === 'expenses' &&
                dayjs(transaction.date).month() === month &&
                dayjs(transaction.date).year() === year
            ).length
          }{' '}
          entries
        </p>
      </div>
      <div className="flex items-center justify-between p-3">
        <p className="text-xl">Transfer</p>
        <p className="text-lg">
          {
            transactions.filter(
              transaction =>
                transaction.type === 'transfer' &&
                dayjs(transaction.date).month() === month &&
                dayjs(transaction.date).year() === year
            ).length
          }{' '}
          entries
        </p>
      </div>
      <div className="flex items-center justify-between print:bg-black/[3%]">
        <p className="p-3 text-xl font-semibold">Total</p>
        <p
          className="p-3 text-lg font-medium"
          style={{
            borderTop: '2px solid',
            borderBottom: '6px double'
          }}
        >
          {
            transactions.filter(
              transaction =>
                dayjs(transaction.date).month() === month &&
                dayjs(transaction.date).year() === year
            ).length
          }{' '}
          entries
        </p>
      </div>
    </div>
  )
}

export default TransactionsSummary
