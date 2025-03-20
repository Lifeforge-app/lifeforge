import { Icon } from '@iconify/react'
import clsx from 'clsx'

import { DashboardItem, QueryWrapper } from '@lifeforge/ui'

import { useWalletContext } from '@apps/Wallet/providers/WalletProvider'

function IncomeExpenseCard({ title, icon }: { title: string; icon: string }) {
  const isIncome = title.toLowerCase() === 'income'
  const { isAmountHidden, incomeExpensesQuery } = useWalletContext()

  return (
    <DashboardItem
      className="col-span-1 row-span-1"
      icon={icon}
      namespace="apps.wallet"
      title={isIncome ? 'income' : 'expenses'}
    >
      <QueryWrapper query={incomeExpensesQuery}>
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
                +data[
                  `total${title}` as 'totalIncome' | 'totalExpenses'
                ].toFixed(2)
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
                  +data[
                    `monthly${title}` as 'monthlyIncome' | 'monthlyExpenses'
                  ].toFixed(2)
                )}
              </span>{' '}
              from this month
            </p>
          </div>
        )}
      </QueryWrapper>
    </DashboardItem>
  )
}

export default IncomeExpenseCard
