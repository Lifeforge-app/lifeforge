import clsx from 'clsx'

import { IWalletTransaction } from '@apps/Wallet/pages/Transactions'
import numberToCurrency from '@apps/Wallet/utils/numberToCurrency'

function OverviewSummary({
  filteredTransactions
}: {
  filteredTransactions: IWalletTransaction[]
}) {
  return (
    <div className="mt-6 flex w-full flex-col">
      <div className="flex items-center justify-between p-3">
        <p className="text-xl">Income</p>
        <p className="text-lg">
          RM{' '}
          {numberToCurrency(
            filteredTransactions.reduce((acc, curr) => {
              if (curr.type === 'income') return acc + curr.amount

              return acc
            }, 0)
          )}
        </p>
      </div>
      <div className="bg-bg-200 dark:bg-bg-900 flex items-center justify-between p-3 print:bg-black/[3%]!">
        <p className="text-xl">Expenses</p>
        <p className="text-lg">
          RM (
          {numberToCurrency(
            filteredTransactions.reduce((acc, curr) => {
              if (curr.type === 'expenses') return acc + curr.amount

              return acc
            }, 0)
          )}
          )
        </p>
      </div>
      <div className="flex items-center justify-between">
        <p className="p-3 text-xl font-semibold">Net Income / (Loss)</p>
        {(() => {
          const netIncome = filteredTransactions.reduce((acc, curr) => {
            if (curr.type === 'income') return acc + curr.amount
            if (curr.type === 'expenses') return acc - curr.amount

            return acc
          }, 0)

          return (
            <p
              className={clsx(
                'p-3 text-lg font-medium',
                netIncome < 0 && 'text-rose-600'
              )}
              style={{
                borderTop: '2px solid',
                borderBottom: '6px double'
              }}
            >
              RM{' '}
              {netIncome >= 0
                ? numberToCurrency(netIncome)
                : `(${numberToCurrency(Math.abs(netIncome))})`}
            </p>
          )
        })()}
      </div>
    </div>
  )
}

export default OverviewSummary
