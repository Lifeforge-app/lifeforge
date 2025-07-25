import { useWalletData } from '@apps/Wallet/hooks/useWalletData'
import type { IWalletTransaction } from '@apps/Wallet/pages/Transactions'
import numberToCurrency from '@apps/Wallet/utils/numberToCurrency'

function getAmounts({
  asset,
  transactions,
  month,
  year
}: {
  asset: ISchemaWithPB<WalletCollectionsSchemas.IAssetAggregated>
  transactions: IWalletTransaction[]
  month: number
  year: number
}) {
  const balance = asset.current_balance

  console.log(balance)

  const transactionsForAsset = transactions.filter(transaction =>
    transaction.type !== 'transfer'
      ? transaction.asset === asset.id
      : transaction.to === asset.id || transaction.from === asset.id
  )

  const transactionsAfterMonth = transactionsForAsset.filter(
    transaction =>
      dayjs(transaction.date).month() > month &&
      dayjs(transaction.date).year() === year
  )

  const transactionsThisMonth = transactionsForAsset.filter(
    transaction =>
      dayjs(transaction.date).month() === month &&
      dayjs(transaction.date).year() === year
  )

  const thatMonthAmount =
    balance -
    transactionsAfterMonth.reduce((acc, curr) => {
      if (curr.type === 'income') {
        return acc + curr.amount
      }

      if (curr.type === 'expenses') {
        return acc - curr.amount
      }

      if (curr.type === 'transfer') {
        if (curr.to === asset.id) {
          return acc - curr.amount
        }

        if (curr.from === asset.id) {
          return acc + curr.amount
        }
      }

      return acc
    }, 0)

  const lastMonthAmount =
    thatMonthAmount -
    transactionsThisMonth.reduce((acc, curr) => {
      if (curr.type === 'income') {
        return acc - curr.amount
      }

      if (curr.type === 'expenses') {
        return acc + curr.amount
      }

      if (curr.type === 'transfer') {
        if (curr.to === asset.id) {
          return acc - curr.amount
        }

        if (curr.from === asset.id) {
          return acc + curr.amount
        }
      }

      return acc
    }, 0)

  return { thatMonthAmount, lastMonthAmount }
}

function AssetsTable({ month, year }: { month: number; year: number }) {
  const { assetsQuery, transactionsQuery } = useWalletData()

  const transactions = transactionsQuery.data ?? []

  return (
    <QueryWrapper query={assetsQuery}>
      {assets => (
        <div className="overflow-x-auto">
          <table className="mt-6 w-full">
            <thead>
              <tr className="bg-custom-500 text-white print:bg-lime-600">
                <th className="w-full p-3 text-left text-lg font-medium">
                  Assets
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
              {assets
                .sort((a, b) => a.name.localeCompare(b.name))
                .map(asset => (
                  <tr
                    key={asset.id}
                    className="even:bg-bg-200 dark:even:bg-bg-800/30 print:even:bg-black/[3%]"
                  >
                    <td className="p-3 text-lg">
                      <div className="flex items-center gap-2">
                        <Icon className="size-6 shrink-0" icon={asset.icon} />
                        <span className="whitespace-nowrap">{asset.name}</span>
                      </div>
                    </td>
                    {(() => {
                      if (typeof transactions === 'string') {
                        return <></>
                      }

                      const { thatMonthAmount, lastMonthAmount } = getAmounts({
                        asset,
                        transactions,
                        month,
                        year
                      })

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
                              thatMonthAmount - lastMonthAmount < 0 &&
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
                              thatMonthAmount - lastMonthAmount < 0 &&
                                'text-rose-600'
                            )}
                          >
                            {Math.abs(lastMonthAmount) < 0.001
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
                    <span>Total Assets</span>
                  </div>
                </td>
                {(() => {
                  if (typeof transactions === 'string') return <></>

                  const balance = assets.reduce(
                    (acc, curr) => acc + curr.current_balance,
                    0
                  )

                  const transactionsAfterMonth = transactions.filter(
                    transaction =>
                      dayjs(transaction.date).month() > month &&
                      dayjs(transaction.date).year() === year
                  )

                  const transactionsThisMonth = transactions.filter(
                    transaction =>
                      dayjs(transaction.date).month() === month &&
                      dayjs(transaction.date).year() === year
                  )

                  const thatMonthAmount =
                    balance -
                    transactionsAfterMonth.reduce((acc, curr) => {
                      if (curr.type === 'income') {
                        return acc + curr.amount
                      }

                      if (curr.type === 'expenses') {
                        return acc - curr.amount
                      }

                      return acc
                    }, 0)

                  const lastMonthAmount =
                    thatMonthAmount -
                    transactionsThisMonth.reduce((acc, curr) => {
                      if (curr.type === 'income') {
                        return acc + curr.amount
                      }

                      if (curr.type === 'expenses') {
                        return acc - curr.amount
                      }

                      return acc
                    }, 0)

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
                          thatMonthAmount - lastMonthAmount < 0 &&
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
                          thatMonthAmount - lastMonthAmount < 0 &&
                            'text-rose-600'
                        )}
                        style={{
                          borderTop: '2px solid',
                          borderBottom: '6px double'
                        }}
                      >
                        {Math.abs(lastMonthAmount) < 0.001
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
    </QueryWrapper>
  )
}

export default AssetsTable
