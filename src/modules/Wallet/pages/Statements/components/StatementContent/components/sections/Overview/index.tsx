import { Icon } from '@iconify/react'
import moment from 'moment'
import React, { useMemo } from 'react'
import APIFallbackComponent from '@components/screens/APIComponentWithFallback'
import { useWalletContext } from '@providers/WalletProvider'
import { numberToMoney } from '@utils/strings'

function Overview({
  month,
  year
}: {
  month: number
  year: number
}): React.ReactElement {
  const { transactions, assets, categories } = useWalletContext()
  const filteredTransactions = useMemo(() => {
    if (typeof transactions === 'string') return []

    return transactions.filter(
      transaction =>
        moment(transaction.date).month() === month &&
        moment(transaction.date).year() === year
    )
  }, [transactions, month, year])

  return (
    <>
      <h2 className="mt-16 text-3xl font-semibold uppercase tracking-widest">
        <span className="text-custom-500 print:text-lime-600">01. </span>
        Overview
      </h2>
      <div className="mt-6 flex w-full flex-col">
        <div className="flex items-center justify-between p-3">
          <p className="text-xl">Income</p>
          <p className="text-lg">
            RM{' '}
            {numberToMoney(
              filteredTransactions.reduce((acc, curr) => {
                if (curr.type === 'income') return acc + curr.amount
                return acc
              }, 0)
            )}
          </p>
        </div>
        <div className="flex items-center justify-between bg-bg-900 p-3 print:bg-black/[3%]!">
          <p className="text-xl">Expenses</p>
          <p className="text-lg">
            RM (
            {numberToMoney(
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
                className={`p-3 text-lg font-medium ${
                  netIncome < 0 && 'text-rose-600'
                }`}
                style={{
                  borderTop: '2px solid',
                  borderBottom: '6px double'
                }}
              >
                RM{' '}
                {netIncome >= 0
                  ? numberToMoney(netIncome)
                  : `(${numberToMoney(Math.abs(netIncome))})`}
              </p>
            )
          })()}
        </div>
      </div>
      <h2 className="mt-16 text-2xl font-semibold uppercase tracking-widest">
        <span>1.1 </span>
        Assets
      </h2>
      <APIFallbackComponent data={assets}>
        {assets => (
          <div className="overflow-x-auto">
            <table className="mt-6 w-full">
              <thead>
                <tr className="bg-custom-500 text-white print:bg-lime-600">
                  <th className="w-full p-3 text-left text-lg font-medium">
                    Assets
                  </th>
                  <th className="whitespace-nowrap p-3 text-lg font-medium">
                    {moment()
                      .month(month - 1)
                      .format('MMM YYYY')}
                  </th>
                  <th className="whitespace-nowrap p-3 text-lg font-medium">
                    {moment().month(month).format('MMM YYYY')}
                  </th>
                  <th
                    className="whitespace-nowrap p-3 text-lg font-medium"
                    colSpan={2}
                  >
                    Change
                  </th>
                </tr>
                <tr className="bg-zinc-800 text-white print:bg-black/70">
                  <th className="w-full px-4 py-2 text-left text-lg font-medium"></th>
                  <th className="px-4 py-2 text-lg font-medium">RM</th>
                  <th className="px-4 py-2 text-lg font-medium">RM</th>
                  <th className="px-4 py-2 text-lg font-medium">RM</th>
                  <th className="px-4 py-2 text-lg font-medium">%</th>
                </tr>
              </thead>
              <tbody>
                {assets
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map(asset => (
                    <tr
                      key={asset.id}
                      className="even:bg-zinc-800/30 print:even:bg-black/[3%]"
                    >
                      <td className="p-3 text-lg">
                        <div className="flex items-center gap-2">
                          <Icon className="size-6 shrink-0" icon={asset.icon} />
                          <span className="whitespace-nowrap">
                            {asset.name}
                          </span>
                        </div>
                      </td>
                      {(() => {
                        if (typeof transactions === 'string') {
                          return <></>
                        }
                        const balance = asset.balance

                        const transactionsForAsset = transactions.filter(
                          transaction => transaction.asset === asset.id
                        )

                        const transactionsAfterMonth =
                          transactionsForAsset.filter(
                            transaction =>
                              moment(transaction.date).month() > month &&
                              moment(transaction.date).year() === year
                          )

                        const transactionsThisMonth =
                          transactionsForAsset.filter(
                            transaction =>
                              moment(transaction.date).month() === month &&
                              moment(transaction.date).year() === year
                          )

                        const thatMonthAmount =
                          balance -
                          transactionsAfterMonth.reduce((acc, curr) => {
                            if (curr.side === 'debit') {
                              return acc + curr.amount
                            }
                            if (curr.side === 'credit') {
                              return acc - curr.amount
                            }
                            return acc
                          }, 0)

                        const lastMonthAmount =
                          thatMonthAmount -
                          transactionsThisMonth.reduce((acc, curr) => {
                            if (curr.side === 'debit') {
                              return acc + curr.amount
                            }
                            if (curr.side === 'credit') {
                              return acc - curr.amount
                            }
                            return acc
                          }, 0)

                        return (
                          <>
                            <td className="whitespace-nowrap p-3 text-right text-lg">
                              {numberToMoney(lastMonthAmount)}
                            </td>
                            <td className="whitespace-nowrap p-3 text-right text-lg">
                              {numberToMoney(thatMonthAmount)}
                            </td>
                            <td
                              className={`whitespace-nowrap p-3 text-right text-lg ${
                                thatMonthAmount - lastMonthAmount < 0 &&
                                'text-rose-600'
                              }`}
                            >
                              {thatMonthAmount - lastMonthAmount < 0
                                ? `(${numberToMoney(
                                    Math.abs(thatMonthAmount - lastMonthAmount)
                                  )})`
                                : numberToMoney(
                                    thatMonthAmount - lastMonthAmount
                                  )}
                            </td>
                            <td
                              className={`whitespace-nowrap p-3 text-right text-lg ${
                                thatMonthAmount - lastMonthAmount < 0 &&
                                'text-rose-600'
                              }`}
                            >
                              {lastMonthAmount === 0
                                ? '-'
                                : `${(
                                    ((thatMonthAmount - lastMonthAmount) /
                                      lastMonthAmount) *
                                    100
                                  ).toFixed(2)}%`}
                            </td>
                          </>
                        )
                      })()}
                    </tr>
                  ))}
                <tr className="even:bg-zinc-800/30 print:even:bg-black/[3%]">
                  <td className="p-3 text-lg">
                    <div className="flex items-center gap-2 text-xl font-semibold">
                      <span>Total Assets</span>
                    </div>
                  </td>
                  {(() => {
                    if (typeof transactions === 'string') return <></>
                    const balance = assets.reduce(
                      (acc, curr) => acc + curr.balance,
                      0
                    )

                    const transactionsAfterMonth = transactions.filter(
                      transaction =>
                        moment(transaction.date).month() > month &&
                        moment(transaction.date).year() === year
                    )

                    const transactionsThisMonth = transactions.filter(
                      transaction =>
                        moment(transaction.date).month() === month &&
                        moment(transaction.date).year() === year
                    )

                    const thatMonthAmount =
                      balance -
                      transactionsAfterMonth.reduce((acc, curr) => {
                        if (curr.side === 'debit') {
                          return acc + curr.amount
                        }
                        if (curr.side === 'credit') {
                          return acc - curr.amount
                        }
                        return acc
                      }, 0)

                    const lastMonthAmount =
                      thatMonthAmount -
                      transactionsThisMonth.reduce((acc, curr) => {
                        if (curr.side === 'debit') {
                          return acc + curr.amount
                        }
                        if (curr.side === 'credit') {
                          return acc - curr.amount
                        }
                        return acc
                      }, 0)

                    return (
                      <>
                        <td
                          className="whitespace-nowrap p-3 text-right text-lg font-medium"
                          style={{
                            borderTop: '2px solid',
                            borderBottom: '6px double'
                          }}
                        >
                          {numberToMoney(lastMonthAmount)}
                        </td>
                        <td
                          className="whitespace-nowrap p-3 text-right text-lg font-medium"
                          style={{
                            borderTop: '2px solid',
                            borderBottom: '6px double'
                          }}
                        >
                          {numberToMoney(thatMonthAmount)}
                        </td>
                        <td
                          className={`whitespace-nowrap p-3 text-right text-lg font-medium ${
                            thatMonthAmount - lastMonthAmount < 0 &&
                            'text-rose-600'
                          }`}
                          style={{
                            borderTop: '2px solid',
                            borderBottom: '6px double'
                          }}
                        >
                          {thatMonthAmount - lastMonthAmount < 0
                            ? `(${numberToMoney(
                                Math.abs(thatMonthAmount - lastMonthAmount)
                              )})`
                            : numberToMoney(thatMonthAmount - lastMonthAmount)}
                        </td>
                        <td
                          className={`whitespace-nowrap p-3 text-right text-lg font-medium ${
                            thatMonthAmount - lastMonthAmount < 0 &&
                            'text-rose-600'
                          }`}
                          style={{
                            borderTop: '2px solid',
                            borderBottom: '6px double'
                          }}
                        >
                          {lastMonthAmount === 0
                            ? '-'
                            : `${(
                                ((thatMonthAmount - lastMonthAmount) /
                                  lastMonthAmount) *
                                100
                              ).toFixed(2)}%`}
                        </td>
                      </>
                    )
                  })()}
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </APIFallbackComponent>
      {['income', 'expenses'].map(type => (
        <div key={type}>
          <h2 className="mt-16 text-2xl font-semibold uppercase tracking-widest">
            <span>1.{type === 'income' ? '2' : '3'} </span>
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </h2>
          <APIFallbackComponent data={categories}>
            {categories => (
              <div className="overflow-x-auto overflow-y-hidden">
                <table className="mt-6 w-full">
                  <thead>
                    <tr className="bg-custom-500 text-white print:bg-lime-600">
                      <th className="w-full p-3 text-left text-lg font-medium">
                        Category
                      </th>
                      <th className="whitespace-nowrap p-3 text-lg font-medium">
                        {moment()
                          .month(month - 1)
                          .format('MMM YYYY')}
                      </th>
                      <th className="whitespace-nowrap p-3 text-lg font-medium">
                        {moment().month(month).format('MMM YYYY')}
                      </th>
                      <th
                        className="whitespace-nowrap p-3 text-lg font-medium"
                        colSpan={2}
                      >
                        Change
                      </th>
                    </tr>
                    <tr className="bg-zinc-800 text-white print:bg-black/70">
                      <th className="w-full px-4 py-2 text-left text-lg font-medium"></th>
                      <th className="px-4 py-2 text-lg font-medium">RM</th>
                      <th className="px-4 py-2 text-lg font-medium">RM</th>
                      <th className="px-4 py-2 text-lg font-medium">RM</th>
                      <th className="px-4 py-2 text-lg font-medium">%</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories
                      .filter(category => category.type === type)
                      .sort((a, b) => a.name.localeCompare(b.name))
                      .map(category => (
                        <tr
                          key={category.id}
                          className="even:bg-zinc-800/30 print:even:bg-black/[3%]"
                        >
                          <td className="p-3 text-lg">
                            <div className="flex items-center gap-2">
                              <Icon
                                className="size-6 shrink-0"
                                icon={category.icon}
                                style={{
                                  color: category.color
                                }}
                              />
                              <span className="whitespace-nowrap">
                                {category.name}
                              </span>
                            </div>
                          </td>
                          {(() => {
                            if (typeof transactions === 'string') {
                              return <></>
                            }

                            const lastMonth = moment()
                              .year(year)
                              .month(month - 1)

                            const lastMonthAmount = transactions
                              .filter(
                                transaction =>
                                  moment(transaction.date).month() ===
                                    lastMonth.month() &&
                                  moment(transaction.date).year() ===
                                    lastMonth.year() &&
                                  transaction.category === category.id
                              )
                              .reduce((acc, curr) => acc + curr.amount, 0)

                            const thatMonthAmount = transactions
                              .filter(
                                transaction =>
                                  moment(transaction.date).month() === month &&
                                  moment(transaction.date).year() === year &&
                                  transaction.category === category.id
                              )
                              .reduce((acc, curr) => acc + curr.amount, 0)

                            return (
                              <>
                                <td className="whitespace-nowrap p-3 text-right text-lg">
                                  {numberToMoney(lastMonthAmount)}
                                </td>
                                <td className="whitespace-nowrap p-3 text-right text-lg">
                                  {numberToMoney(thatMonthAmount)}
                                </td>
                                <td
                                  className={`whitespace-nowrap p-3 text-right text-lg ${
                                    (type === 'income'
                                      ? thatMonthAmount - lastMonthAmount
                                      : lastMonthAmount - thatMonthAmount) <
                                      0 && 'text-rose-600'
                                  }`}
                                >
                                  {thatMonthAmount - lastMonthAmount < 0
                                    ? `(${numberToMoney(
                                        Math.abs(
                                          thatMonthAmount - lastMonthAmount
                                        )
                                      )})`
                                    : numberToMoney(
                                        thatMonthAmount - lastMonthAmount
                                      )}
                                </td>
                                <td
                                  className={`whitespace-nowrap p-3 text-right text-lg ${
                                    (type === 'income'
                                      ? thatMonthAmount - lastMonthAmount
                                      : lastMonthAmount - thatMonthAmount) <
                                      0 && 'text-rose-600'
                                  }`}
                                >
                                  {lastMonthAmount === 0
                                    ? '-'
                                    : `${(
                                        ((thatMonthAmount - lastMonthAmount) /
                                          lastMonthAmount) *
                                        100
                                      ).toFixed(2)}%`}
                                </td>
                              </>
                            )
                          })()}
                        </tr>
                      ))}
                    <tr className="even:bg-zinc-800/30 print:even:bg-black/[3%]">
                      <td className="p-3 text-lg">
                        <div className="flex items-center gap-2 text-xl font-semibold">
                          <span>
                            Total {type === 'income' ? 'Income' : 'Expenses'}
                          </span>
                        </div>
                      </td>
                      {(() => {
                        if (typeof transactions === 'string') {
                          return <></>
                        }

                        const lastMonth = moment()
                          .year(year)
                          .month(month - 1)
                        const lastMonthAmount = transactions
                          .filter(
                            transaction =>
                              transaction.type === type &&
                              moment(transaction.date).month() ===
                                lastMonth.month() &&
                              moment(transaction.date).year() ===
                                lastMonth.year()
                          )
                          .reduce((acc, curr) => acc + curr.amount, 0)

                        const thatMonthAmount = transactions
                          .filter(
                            transaction =>
                              transaction.type === type &&
                              moment(transaction.date).month() === month &&
                              moment(transaction.date).year() === year
                          )
                          .reduce((acc, curr) => acc + curr.amount, 0)

                        return (
                          <>
                            <td
                              className="whitespace-nowrap p-3 text-right text-lg font-medium"
                              style={{
                                borderTop: '2px solid',
                                borderBottom: '6px double'
                              }}
                            >
                              {numberToMoney(lastMonthAmount)}
                            </td>
                            <td
                              className="whitespace-nowrap p-3 text-right text-lg font-medium"
                              style={{
                                borderTop: '2px solid',
                                borderBottom: '6px double'
                              }}
                            >
                              {numberToMoney(thatMonthAmount)}
                            </td>
                            <td
                              className={`whitespace-nowrap p-3 text-right text-lg font-medium ${
                                (type === 'income'
                                  ? thatMonthAmount - lastMonthAmount
                                  : lastMonthAmount - thatMonthAmount) < 0 &&
                                'text-rose-600'
                              }`}
                              style={{
                                borderTop: '2px solid',
                                borderBottom: '6px double'
                              }}
                            >
                              {thatMonthAmount - lastMonthAmount < 0
                                ? `(${numberToMoney(
                                    Math.abs(thatMonthAmount - lastMonthAmount)
                                  )})`
                                : numberToMoney(
                                    thatMonthAmount - lastMonthAmount
                                  )}
                            </td>
                            <td
                              className={`whitespace-nowrap p-3 text-right text-lg font-medium ${
                                (type === 'income'
                                  ? thatMonthAmount - lastMonthAmount
                                  : lastMonthAmount - thatMonthAmount) < 0 &&
                                'text-rose-600'
                              }`}
                              style={{
                                borderTop: '2px solid',
                                borderBottom: '6px double'
                              }}
                            >
                              {lastMonthAmount === 0
                                ? '-'
                                : `${(
                                    ((thatMonthAmount - lastMonthAmount) /
                                      lastMonthAmount) *
                                    100
                                  ).toFixed(2)}%`}
                            </td>
                          </>
                        )
                      })()}
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

export default Overview
