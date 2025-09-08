import { Icon } from '@iconify/react'
import dayjs from 'dayjs'

import { useWalletData } from '@apps/03.Finance/Wallet/hooks/useWalletData'
import numberToCurrency from '@apps/03.Finance/Wallet/utils/numberToCurrency'

function TransactionList({
  type,
  month,
  year
}: {
  type: 'income' | 'expenses' | 'transfer'
  month: number
  year: number
}) {
  const { transactionsQuery, assetsQuery, categoriesQuery } = useWalletData()

  const transactions = transactionsQuery.data ?? []

  const assets = assetsQuery.data ?? []

  const categories = categoriesQuery.data ?? []

  return (
    <>
      <h2 className="mt-16 text-2xl font-semibold tracking-widest uppercase">
        <span>
          2.
          {['income', 'expenses', 'transfer'].indexOf(type) + 1}{' '}
        </span>
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </h2>
      <div className="overflow-x-auto">
        <table className="mt-6 w-full">
          <thead>
            <tr className="bg-custom-500 text-white print:bg-lime-600">
              <th className="p-3 text-lg font-medium whitespace-nowrap">
                Date
              </th>
              <th className="w-full p-3 text-left text-lg font-medium">
                Particular
              </th>

              {type !== 'transfer' && (
                <>
                  <th className="p-3 text-lg font-medium whitespace-nowrap">
                    Asset
                  </th>
                  <th className="p-3 text-lg font-medium whitespace-nowrap">
                    Category
                  </th>
                </>
              )}
              <th className="p-3 text-lg font-medium whitespace-nowrap">
                Amount
              </th>
            </tr>
            <tr className="bg-bg-800 text-white print:bg-black/70">
              <th className="p-3 text-lg font-medium whitespace-nowrap"></th>
              <th className="w-full p-3 text-left text-lg font-medium"></th>
              {type !== 'transfer' && (
                <>
                  <th className="p-3 text-lg font-medium whitespace-nowrap"></th>
                  <th className="p-3 text-lg font-medium whitespace-nowrap"></th>
                </>
              )}
              <th className="p-3 text-lg font-medium whitespace-nowrap">RM</th>
            </tr>
          </thead>
          <tbody>
            {transactions
              .filter(
                transaction =>
                  transaction.type === type &&
                  dayjs(transaction.date).month() === month &&
                  dayjs(transaction.date).year() === year
              )
              .sort((a, b) => dayjs(a.date).diff(b.date))
              .map((transaction, index) => (
                <tr
                  key={transaction.id}
                  className="even:bg-bg-200 dark:even:bg-bg-800/30 print:even:bg-black/[3%]"
                >
                  <td className="p-3 text-lg whitespace-nowrap">
                    {((type === 'transfer' && index % 2 === 0) ||
                      type !== 'transfer') &&
                      dayjs(transaction.date).format('MMM DD')}
                  </td>
                  <td className="min-w-96 p-3 text-lg">
                    {transaction.type === 'transfer' ? (
                      <>
                        Transfer from{' '}
                        {assets.find(asset => asset.id === transaction.from)
                          ?.name ?? 'Unknown Asset'}{' '}
                        to{' '}
                        {assets.find(asset => asset.id === transaction.to)
                          ?.name ?? 'Unknown Asset'}
                      </>
                    ) : (
                      transaction.particulars
                    )}
                  </td>
                  {transaction.type !== 'transfer' && (
                    <td className="p-3 text-lg whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Icon
                          className="size-6 shrink-0"
                          icon={
                            assets.find(asset => asset.id === transaction.asset)
                              ?.icon ?? 'tabler:coin'
                          }
                        />
                        <span>
                          {
                            assets.find(asset => asset.id === transaction.asset)
                              ?.name
                          }
                        </span>
                      </div>
                    </td>
                  )}
                  {type !== 'transfer' && (
                    <td className="p-3 text-lg whitespace-nowrap">
                      {transaction.type !== 'transfer' && (
                        <div className="flex items-center gap-2">
                          <Icon
                            className="size-6 shrink-0"
                            icon={
                              categories.find(
                                category => category.id === transaction.category
                              )?.icon ?? ''
                            }
                            style={{
                              color: categories.find(
                                category => category.id === transaction.category
                              )?.color
                            }}
                          />
                          <span>
                            {
                              categories.find(
                                category => category.id === transaction.category
                              )?.name
                            }
                          </span>
                        </div>
                      )}
                    </td>
                  )}
                  <td className="p-3 text-right text-lg whitespace-nowrap">
                    {transaction.type === 'expenses'
                      ? `(${numberToCurrency(transaction.amount)})`
                      : numberToCurrency(transaction.amount)}
                  </td>
                </tr>
              ))}
            <tr className="even:bg-bg-200 dark:even:bg-bg-800/30 print:even:bg-black/[3%]">
              <td
                className="p-3 text-left text-xl font-semibold whitespace-nowrap"
                colSpan={type !== 'transfer' ? 4 : 2}
              >
                Total {type.charAt(0).toUpperCase() + type.slice(1)}
              </td>
              <td
                className="p-3 text-right text-lg font-medium whitespace-nowrap"
                style={{
                  borderTop: '2px solid',
                  borderBottom: '6px double'
                }}
              >
                {(() => {
                  const amount = transactions
                    .filter(
                      transaction =>
                        transaction.type === type &&
                        dayjs(transaction.date).month() === month &&
                        dayjs(transaction.date).year() === year
                    )
                    .reduce((acc, curr) => {
                      if (curr.type !== 'transfer') {
                        if (curr.type === 'income') {
                          return acc + curr.amount
                        }

                        if (curr.type === 'expenses') {
                          return acc - curr.amount
                        }
                      } else {
                        return acc + curr.amount / 2
                      }

                      return acc
                    }, 0)

                  return (
                    <span className="font-medium">
                      {amount < 0
                        ? `(${numberToCurrency(Math.abs(amount))})`
                        : numberToCurrency(amount)}
                    </span>
                  )
                })()}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  )
}

export default TransactionList
