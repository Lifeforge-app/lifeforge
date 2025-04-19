import { Icon } from '@iconify/react/dist/iconify.js'
import clsx from 'clsx'
import dayjs from 'dayjs'

import { useWalletData } from '@apps/Wallet/hooks/useWalletData'
import numberToCurrency from '@apps/Wallet/utils/numberToCurrency'

function IncomeExpensesTable({
  month,
  year,
  type
}: {
  month: number
  year: number
  type: 'income' | 'expenses'
}) {
  const { transactionsQuery, categoriesQuery } = useWalletData()
  const transactions = transactionsQuery.data ?? []
  const categories = categoriesQuery.data ?? []

  return (
    <>
      <h2 className="mt-16 text-2xl font-semibold tracking-widest uppercase">
        <span>1.{type === 'income' ? '2' : '3'} </span>
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </h2>
      <div className="overflow-x-auto overflow-y-hidden">
        <table className="mt-6 w-full">
          <thead>
            <tr className="bg-custom-500 text-white print:bg-lime-600">
              <th className="w-full p-3 text-left text-lg font-medium">
                Category
              </th>
              <th className="p-3 text-lg font-medium whitespace-nowrap">
                {dayjs()
                  .month(month - 1)
                  .format('MMM YYYY')}
              </th>
              <th className="p-3 text-lg font-medium whitespace-nowrap">
                {dayjs().month(month).format('MMM YYYY')}
              </th>
              <th
                className="p-3 text-lg font-medium whitespace-nowrap"
                colSpan={2}
              >
                Change
              </th>
            </tr>
            <tr className="bg-bg-800 text-white print:bg-black/70">
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
                  className="even:bg-bg-200 dark:even:bg-bg-800/30 print:even:bg-black/[3%]"
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
                      <span className="whitespace-nowrap">{category.name}</span>
                    </div>
                  </td>
                  {(() => {
                    if (typeof transactions === 'string') {
                      return <></>
                    }

                    const lastMonth = dayjs()
                      .year(year)
                      .month(month - 1)

                    const lastMonthAmount = transactions
                      .filter(
                        transaction =>
                          dayjs(transaction.date).month() ===
                            lastMonth.month() &&
                          dayjs(transaction.date).year() === lastMonth.year() &&
                          transaction.category === category.id
                      )
                      .reduce((acc, curr) => acc + curr.amount, 0)

                    const thatMonthAmount = transactions
                      .filter(
                        transaction =>
                          dayjs(transaction.date).month() === month &&
                          dayjs(transaction.date).year() === year &&
                          transaction.category === category.id
                      )
                      .reduce((acc, curr) => acc + curr.amount, 0)

                    return (
                      <>
                        <td className="p-3 text-right text-lg whitespace-nowrap">
                          {numberToCurrency(lastMonthAmount)}
                        </td>
                        <td className="p-3 text-right text-lg whitespace-nowrap">
                          {numberToCurrency(thatMonthAmount)}
                        </td>
                        <td
                          className={clsx(
                            'p-3 text-right text-lg whitespace-nowrap',
                            (type === 'income'
                              ? thatMonthAmount - lastMonthAmount
                              : lastMonthAmount - thatMonthAmount) < 0 &&
                              'text-rose-600'
                          )}
                        >
                          {thatMonthAmount - lastMonthAmount < 0
                            ? `(${numberToCurrency(
                                Math.abs(thatMonthAmount - lastMonthAmount)
                              )})`
                            : numberToCurrency(
                                thatMonthAmount - lastMonthAmount
                              )}
                        </td>
                        <td
                          className={clsx(
                            'p-3 text-right text-lg whitespace-nowrap',
                            (type === 'income'
                              ? thatMonthAmount - lastMonthAmount
                              : lastMonthAmount - thatMonthAmount) < 0 &&
                              'text-rose-600'
                          )}
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
            <tr className="even:bg-bg-200 dark:even:bg-bg-800/30 print:even:bg-black/[3%]">
              <td className="p-3 text-lg">
                <div className="flex items-center gap-2 text-xl font-semibold">
                  <span>Total {type === 'income' ? 'Income' : 'Expenses'}</span>
                </div>
              </td>
              {(() => {
                if (typeof transactions === 'string') {
                  return <></>
                }

                const lastMonth = dayjs()
                  .year(year)
                  .month(month - 1)
                const lastMonthAmount = transactions
                  .filter(
                    transaction =>
                      transaction.type === type &&
                      dayjs(transaction.date).month() === lastMonth.month() &&
                      dayjs(transaction.date).year() === lastMonth.year()
                  )
                  .reduce((acc, curr) => acc + curr.amount, 0)

                const thatMonthAmount = transactions
                  .filter(
                    transaction =>
                      transaction.type === type &&
                      dayjs(transaction.date).month() === month &&
                      dayjs(transaction.date).year() === year
                  )
                  .reduce((acc, curr) => acc + curr.amount, 0)

                return (
                  <>
                    <td
                      className="p-3 text-right text-lg font-medium whitespace-nowrap"
                      style={{
                        borderTop: '2px solid',
                        borderBottom: '6px double'
                      }}
                    >
                      {numberToCurrency(lastMonthAmount)}
                    </td>
                    <td
                      className="p-3 text-right text-lg font-medium whitespace-nowrap"
                      style={{
                        borderTop: '2px solid',
                        borderBottom: '6px double'
                      }}
                    >
                      {numberToCurrency(thatMonthAmount)}
                    </td>
                    <td
                      className={clsx(
                        'p-3 text-right text-lg font-medium whitespace-nowrap',
                        (type === 'income'
                          ? thatMonthAmount - lastMonthAmount
                          : lastMonthAmount - thatMonthAmount) < 0 &&
                          'text-rose-600'
                      )}
                      style={{
                        borderTop: '2px solid',
                        borderBottom: '6px double'
                      }}
                    >
                      {thatMonthAmount - lastMonthAmount < 0
                        ? `(${numberToCurrency(
                            Math.abs(thatMonthAmount - lastMonthAmount)
                          )})`
                        : numberToCurrency(thatMonthAmount - lastMonthAmount)}
                    </td>
                    <td
                      className={clsx(
                        'p-3 text-right text-lg font-medium whitespace-nowrap',
                        (type === 'income'
                          ? thatMonthAmount - lastMonthAmount
                          : lastMonthAmount - thatMonthAmount) < 0 &&
                          'text-rose-600'
                      )}
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
    </>
  )
}

export default IncomeExpensesTable
