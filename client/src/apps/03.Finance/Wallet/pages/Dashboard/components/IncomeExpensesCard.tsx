import { Icon } from '@iconify/react'
import { useQuery } from '@tanstack/react-query'
import forgeAPI from '@utils/forgeAPI'
import clsx from 'clsx'
import { DashboardItem, WithQuery } from 'lifeforge-ui'

import { useWalletStore } from '@apps/03.Finance/Wallet/stores/useWalletStore'
import numberToCurrency from '@apps/03.Finance/Wallet/utils/numberToCurrency'

function IncomeExpenseCard({ title, icon }: { title: string; icon: string }) {
  const isIncome = title.toLowerCase() === 'income'

  const { isAmountHidden } = useWalletStore()

  const incomeExpensesQuery = useQuery(
    forgeAPI.wallet.utils.getIncomeExpensesSummary
      .input({
        year: new Date().getFullYear().toString(),
        month: (new Date().getMonth() + 1).toString()
      })
      .queryOptions()
  )

  return (
    <DashboardItem
      className="col-span-1 row-span-1"
      icon={icon}
      namespace="apps.wallet"
      title={isIncome ? 'income' : 'expenses'}
    >
      <WithQuery query={incomeExpensesQuery}>
        {data => (
          <div className="flex h-full flex-col justify-evenly">
            <p className="flex w-full items-end justify-start gap-2 text-4xl font-medium xl:text-5xl">
              <span className="text-bg-500 -mb-0.5 text-2xl xl:text-3xl">
                RM
              </span>
              {isAmountHidden ? (
                <span className="flex items-center">
                  {Array(4)
                    .fill(0)
                    .map((_, i) => (
                      <Icon
                        key={i}
                        className="-mx-0.5 size-6 xl:size-8"
                        icon="uil:asterisk"
                      />
                    ))}
                </span>
              ) : (
                numberToCurrency(
                  +data[`total${title}` as 'totalIncome' | 'totalExpenses']
                )
              )}
            </p>
            <p>
              <span
                className={clsx(
                  'inline-flex items-center',
                  isIncome ? 'text-green-500' : 'text-red-500'
                )}
              >
                {isIncome ? '+' : '-'} RM
                {isAmountHidden ? (
                  <span className="ml-1 flex items-center">
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
                  numberToCurrency(
                    +data[
                      `monthly${title}` as 'monthlyIncome' | 'monthlyExpenses'
                    ]
                  )
                )}
              </span>{' '}
              from this month
            </p>
          </div>
        )}
      </WithQuery>
    </DashboardItem>
  )
}

export default IncomeExpenseCard
