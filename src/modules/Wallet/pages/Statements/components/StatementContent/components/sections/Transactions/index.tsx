import { Icon } from '@iconify/react'
import moment from 'moment'
import React from 'react'
import APIFallbackComponent from '@components/screens/APIComponentWithFallback'
import { useWalletContext } from '@providers/WalletProvider'
import { numberToMoney } from '@utils/strings'

function Transactions({
  month,
  year
}: {
  month: number
  year: number
}): React.ReactElement {
  const { transactions, assets, categories } = useWalletContext()

  return (
    <>
      <h2 className="mt-16 text-3xl font-semibold uppercase tracking-widest">
        <span className="text-custom-500 print:text-lime-600">02. </span>
        Transactions
      </h2>
      <APIFallbackComponent data={transactions}>
        {transactions => (
          <div className="mt-6 flex w-full flex-col">
            <div className="flex items-center justify-between p-3">
              <p className="text-xl">Income</p>
              <p className="text-lg">
                {
                  transactions.filter(
                    transaction =>
                      transaction.type === 'income' &&
                      moment(transaction.date).month() === month &&
                      moment(transaction.date).year() === year
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
                      moment(transaction.date).month() === month &&
                      moment(transaction.date).year() === year
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
                      moment(transaction.date).month() === month &&
                      moment(transaction.date).year() === year
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
                      moment(transaction.date).month() === month &&
                      moment(transaction.date).year() === year
                  ).length
                }{' '}
                entries
              </p>
            </div>
          </div>
        )}
      </APIFallbackComponent>
      {['income', 'expenses', 'transfer'].map(type => (
        <div key={type}>
          <h2 className="mt-16 text-2xl font-semibold uppercase tracking-widest">
            <span>
              2.
              {type === 'income' ? '1' : type === 'expenses' ? '2' : '3'}{' '}
            </span>
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </h2>
          <APIFallbackComponent data={transactions}>
            {transactions => (
              <div className="overflow-x-auto">
                <table className="mt-6 w-full">
                  <thead>
                    <tr className="bg-custom-500 text-white print:bg-lime-600">
                      <th className="whitespace-nowrap p-3 text-lg font-medium">
                        Date
                      </th>
                      <th className="w-full p-3 text-left text-lg font-medium">
                        Particular
                      </th>
                      <th className="whitespace-nowrap p-3 text-lg font-medium">
                        Asset
                      </th>
                      {type !== 'transfer' && (
                        <th className="whitespace-nowrap p-3 text-lg font-medium">
                          Category
                        </th>
                      )}
                      <th className="whitespace-nowrap p-3 text-lg font-medium">
                        Amount
                      </th>
                    </tr>
                    <tr className="bg-zinc-800 text-white print:bg-black/70">
                      <th className="whitespace-nowrap p-3 text-lg font-medium"></th>
                      <th className="w-full p-3 text-left text-lg font-medium"></th>
                      <th className="whitespace-nowrap p-3 text-lg font-medium"></th>
                      {type !== 'transfer' && (
                        <th className="whitespace-nowrap p-3 text-lg font-medium"></th>
                      )}
                      <th className="whitespace-nowrap p-3 text-lg font-medium">
                        RM
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions
                      .filter(
                        transaction =>
                          transaction.type === type &&
                          moment(transaction.date).month() === month &&
                          moment(transaction.date).year() === year
                      )
                      .sort((a, b) => moment(a.date).diff(b.date))
                      .map((transaction, index) => (
                        <tr
                          key={transaction.id}
                          className="even:bg-bg-200 dark:even:bg-zinc-800/30 print:even:bg-black/[3%]"
                        >
                          <td className="whitespace-nowrap p-3 text-lg">
                            {((type === 'transfer' && index % 2 === 0) ||
                              type !== 'transfer') &&
                              moment(transaction.date).format('MMM DD')}
                          </td>
                          <td className="min-w-96 p-3 text-lg">
                            {transaction.particulars}
                          </td>

                          <td className="whitespace-nowrap p-3 text-lg">
                            {typeof assets !== 'string' && (
                              <div className="flex items-center gap-2">
                                <Icon
                                  className="size-6 shrink-0"
                                  icon={
                                    assets.find(
                                      asset => asset.id === transaction.asset
                                    )?.icon ?? 'tabler:coin'
                                  }
                                />
                                <span>
                                  {
                                    assets.find(
                                      asset => asset.id === transaction.asset
                                    )?.name
                                  }
                                </span>
                              </div>
                            )}
                          </td>
                          {type !== 'transfer' && (
                            <td className="whitespace-nowrap p-3 text-lg">
                              {typeof categories !== 'string' && (
                                <div className="flex items-center gap-2">
                                  <Icon
                                    className="size-6 shrink-0"
                                    icon={
                                      categories.find(
                                        category =>
                                          category.id === transaction.category
                                      )?.icon ?? 'tabler:coin'
                                    }
                                    style={{
                                      color: categories.find(
                                        category =>
                                          category.id === transaction.category
                                      )?.color
                                    }}
                                  />
                                  <span>
                                    {
                                      categories.find(
                                        category =>
                                          category.id === transaction.category
                                      )?.name
                                    }
                                  </span>
                                </div>
                              )}
                            </td>
                          )}
                          <td className="whitespace-nowrap p-3 text-right text-lg">
                            {transaction.side === 'credit'
                              ? `(${numberToMoney(transaction.amount)})`
                              : numberToMoney(transaction.amount)}
                          </td>
                        </tr>
                      ))}
                    <tr className="even:bg-bg-200 dark:even:bg-zinc-800/30 print:even:bg-black/[3%]">
                      <td
                        className="whitespace-nowrap p-3 text-left text-xl font-semibold"
                        colSpan={type !== 'transfer' ? 4 : 3}
                      >
                        Total {type.charAt(0).toUpperCase() + type.slice(1)}
                      </td>
                      <td
                        className="whitespace-nowrap p-3 text-right text-lg font-medium"
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
                                moment(transaction.date).month() === month &&
                                moment(transaction.date).year() === year
                            )
                            .reduce((acc, curr) => {
                              if (curr.type !== 'transfer') {
                                if (curr.side === 'debit') {
                                  return acc + curr.amount
                                }
                                if (curr.side === 'credit') {
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
                                ? `(${numberToMoney(Math.abs(amount))})`
                                : numberToMoney(amount)}
                            </span>
                          )
                        })()}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </APIFallbackComponent>
        </div>
      ))}
    </>
  )
}

export default Transactions
