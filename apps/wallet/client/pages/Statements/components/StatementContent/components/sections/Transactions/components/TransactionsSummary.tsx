import { Icon } from '@iconify/react/dist/iconify.js'
import { useWalletData } from '@modules/wallet/client/hooks/useWalletData'
import clsx from 'clsx'
import dayjs from 'dayjs'

function TransactionsSummary({ month, year }: { month: number; year: number }) {
  const { transactionsQuery } = useWalletData()

  const transactions = transactionsQuery.data ?? []

  return (
    <div className="mt-6 flex w-full flex-col">
      {(
        [
          { type: 'income', label: 'Income' },
          { type: 'expenses', label: 'Expenses' },
          { type: 'transfer', label: 'Transfer' }
        ] as const
      ).map(({ type, label }, index) => (
        <div
          key={type}
          className={`flex items-center justify-between p-3 ${
            index === 1 ? 'print:bg-black/[3%]' : ''
          }`}
        >
          <div className="flex items-center gap-2">
            <Icon
              className={clsx('size-6', {
                'text-green-500': type === 'income',
                'text-red-500': type === 'expenses',
                'text-blue-500': type === 'transfer'
              })}
              icon={
                {
                  income: 'tabler:login-2',
                  expenses: 'tabler:logout',
                  transfer: 'tabler:arrows-exchange'
                }[type]
              }
            />
            <p className="text-xl">{label}</p>
          </div>
          <p className="text-lg">
            {
              transactions.filter(
                transaction =>
                  transaction.type === type &&
                  dayjs(transaction.date).month() === month &&
                  dayjs(transaction.date).year() === year
              ).length
            }{' '}
            entries
          </p>
        </div>
      ))}
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
