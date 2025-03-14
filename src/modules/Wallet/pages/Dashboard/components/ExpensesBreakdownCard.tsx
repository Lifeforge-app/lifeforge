import { Icon } from '@iconify/react'
import clsx from 'clsx'
import { useMemo, useState } from 'react'
import { Doughnut } from 'react-chartjs-2'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'

import { APIFallbackComponent, DashboardItem, Scrollbar } from '@lifeforge/ui'

import { useWalletContext } from '@modules/Wallet/providers/WalletProvider'

const options2 = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    }
  },
  cutout: '80%'
}

function ExpensesBreakdownCard() {
  const { categories, transactions, incomeExpenses, isAmountHidden } =
    useWalletContext()
  // TODO
  const [year] = useState(new Date().getFullYear())
  const [month] = useState(new Date().getMonth())

  const expensesCategories = useMemo(() => {
    if (typeof categories === 'string') {
      return []
    }

    return categories.filter(category => category.type === 'expenses')
  }, [categories])

  const thisMonthsTransactions = useMemo(() => {
    if (typeof transactions === 'string') {
      return []
    }

    return transactions.filter(transaction => {
      const date = new Date(transaction.date)
      return date.getFullYear() === year && date.getMonth() === month
    })
  }, [transactions, year, month])

  const spentOnEachCategory = useMemo<Record<string, number>>(() => {
    if (typeof categories === 'string' || typeof transactions === 'string') {
      return {}
    }

    return expensesCategories.reduce<Record<string, number>>(
      (acc, category) => {
        acc[category.id] = thisMonthsTransactions
          .filter(transaction => transaction.category === category.id)
          .reduce((acc, curr) => acc + curr.amount, 0)

        return acc
      },
      {}
    )
  }, [categories, thisMonthsTransactions])

  const { t } = useTranslation('modules.wallet')

  return (
    <DashboardItem
      className="col-span-1 row-span-3"
      componentBesideTitle={
        <Link
          className="text-bg-500 hover:bg-bg-100 hover:text-bg-800 dark:hover:bg-bg-700/30 dark:hover:text-bg-50 flex items-center gap-2 rounded-lg p-2 font-medium transition-all"
          to="/wallet/transactions?type=expenses"
        >
          <Icon className="text-xl" icon="tabler:chevron-right" />
        </Link>
      }
      icon="tabler:chart-donut-3"
      namespace="modules.wallet"
      title="Expenses Breakdown"
    >
      <APIFallbackComponent data={transactions}>
        {() => (
          <APIFallbackComponent data={categories}>
            {categories => (
              <>
                <div className="relative mx-auto flex aspect-square w-4/5 min-w-0 flex-col gap-4">
                  <div className="absolute left-1/2 top-1/2 mt-2 flex size-full -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center">
                    <div
                      className={clsx(
                        'flex text-3xl font-medium sm:text-4xl',
                        isAmountHidden ? 'items-center' : 'items-end'
                      )}
                    >
                      <span className="text-bg-500 mr-1 text-xl">RM</span>
                      {typeof incomeExpenses !== 'string' &&
                        (isAmountHidden ? (
                          <span className="flex items-center">
                            {Array(4)
                              .fill(0)
                              .map((_, i) => (
                                <Icon
                                  key={i}
                                  className="-mx-0.5 size-6 sm:size-8"
                                  icon="uil:asterisk"
                                />
                              ))}
                          </span>
                        ) : (
                          incomeExpenses.monthlyExpenses.toFixed(2)
                        ))}
                    </div>
                    <div className="text-bg-500 mt-2 w-1/2 text-center text-sm sm:text-base">
                      {t('widgets.expensesBreakdown.thisMonthsSpending')}
                    </div>
                  </div>
                  <Doughnut
                    className="relative aspect-square w-full min-w-0"
                    data={{
                      labels: expensesCategories.map(category => category.name),
                      datasets: [
                        {
                          label: 'Monies spent',
                          data: expensesCategories.map(
                            category => spentOnEachCategory[category.id]
                          ),
                          backgroundColor: expensesCategories.map(
                            category => category.color + '20'
                          ),
                          borderColor: expensesCategories.map(
                            category => category.color
                          ),
                          borderWidth: 1
                        }
                      ]
                    }}
                    options={options2}
                  />
                </div>
                <div className="mt-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
                  {expensesCategories
                    .filter(category => spentOnEachCategory[category.id])
                    .map(category => (
                      <div
                        key={category.id}
                        className="flex items-center gap-2"
                      >
                        <span
                          className="-mb-0.5 size-3 rounded-full"
                          style={{
                            backgroundColor: category.color
                          }}
                        ></span>
                        <span className="text-sm">{category.name}</span>
                      </div>
                    ))}
                </div>
                <div className="h-full min-h-96 xl:min-h-0">
                  <Scrollbar className="mb-4">
                    <ul className="divide-bg-200 dark:divide-bg-800 flex flex-col divide-y">
                      {categories
                        .filter(
                          category =>
                            category.type === 'expenses' &&
                            spentOnEachCategory[category.id] > 0
                        )
                        .map(category => (
                          <Link
                            key={category.id}
                            className="flex-between hover:bg-bg-100 dark:hover:bg-bg-800/50 flex gap-4 rounded-md p-4 transition-all"
                            to={`/wallet/transactions?type=expenses&category=${category.id}`}
                          >
                            <div className="flex items-center gap-4">
                              <div
                                className="rounded-md bg-blue-500/20 p-2"
                                style={{
                                  backgroundColor: category.color + '20',
                                  color: category.color
                                }}
                              >
                                <Icon className="size-6" icon={category.icon} />
                              </div>
                              <div className="flex flex-col">
                                <div className="font-semibold">
                                  {category.name}
                                </div>
                                <div className="text-bg-500 text-sm">
                                  {
                                    thisMonthsTransactions.filter(
                                      transaction =>
                                        transaction.category === category.id
                                    ).length
                                  }{' '}
                                  {t('transactionCount')}
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-col">
                              <div
                                className={clsx(
                                  'flex gap-2 text-right font-medium',
                                  isAmountHidden ? 'items-center' : 'items-end'
                                )}
                              >
                                - RM{' '}
                                {isAmountHidden ? (
                                  <span className="flex items-center">
                                    {Array(4)
                                      .fill(0)
                                      .map((_, i) => (
                                        <Icon
                                          key={i}
                                          className="-mx-0.5 size-4"
                                          icon="uil:asterisk"
                                        />
                                      ))}
                                  </span>
                                ) : (
                                  thisMonthsTransactions
                                    .filter(
                                      transaction =>
                                        transaction.category === category.id
                                    )
                                    .reduce((acc, curr) => acc + curr.amount, 0)
                                    .toFixed(2)
                                )}
                              </div>
                              <div className="text-bg-500 text-right text-sm">
                                {(
                                  (thisMonthsTransactions
                                    .filter(
                                      transaction =>
                                        transaction.category === category.id
                                    )
                                    .reduce(
                                      (acc, curr) => acc + curr.amount,
                                      0
                                    ) /
                                    thisMonthsTransactions
                                      .filter(
                                        transaction =>
                                          transaction.type === 'expenses'
                                      )
                                      .reduce(
                                        (acc, curr) => acc + curr.amount,
                                        0
                                      )) *
                                    100 || 0
                                ).toFixed(2)}
                                %
                              </div>
                            </div>
                          </Link>
                        ))}
                    </ul>
                  </Scrollbar>
                </div>
              </>
            )}
          </APIFallbackComponent>
        )}
      </APIFallbackComponent>
    </DashboardItem>
  )
}

export default ExpensesBreakdownCard
