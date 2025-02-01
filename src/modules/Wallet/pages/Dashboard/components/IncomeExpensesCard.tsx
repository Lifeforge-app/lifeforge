import { Icon } from '@iconify/react'
import React from 'react'
import DashboardItem from '@components/utilities/DashboardItem'
import { type Loadable } from '@interfaces/common'
import { type IWalletIncomeExpenses } from '@interfaces/wallet_interfaces'
import { useWalletContext } from '@providers/WalletProvider'
import { numberToMoney } from '@utils/strings'

function IncomeExpenseCard({
  title,
  icon,
  data
}: {
  title: string
  icon: string
  data: Loadable<IWalletIncomeExpenses>
}): React.ReactElement {
  const isIncome = title.toLowerCase() === 'income'
  const { isAmountHidden } = useWalletContext()

  return (
    <DashboardItem
      icon={icon}
      namespace="modules.wallet"
      title={isIncome ? 'income' : 'expenses'}
      className="col-span-1 row-span-1"
    >
      {typeof data !== 'string' && (
        <>
          <div className="flex h-full flex-col justify-evenly">
            <p className="flex w-full items-end justify-start gap-2 text-4xl font-medium xl:text-5xl">
              <span className="-mb-0.5 text-2xl text-bg-500 xl:text-3xl">
                RM
              </span>
              {isAmountHidden ? (
                <span className="flex items-center">
                  {Array(4)
                    .fill(0)
                    .map((_, i) => (
                      <Icon
                        key={i}
                        icon="uil:asterisk"
                        className="-mx-0.5 size-6 xl:size-8"
                      />
                    ))}
                </span>
              ) : (
                numberToMoney(
                  +data[`total${title}` as 'totalIncome' | 'totalExpenses']
                )
              )}
            </p>
            <p>
              <span
                className={`${
                  isIncome ? 'text-green-500' : 'text-red-500'
                } inline-flex items-center`}
              >
                {isIncome ? '+' : '-'} RM
                {isAmountHidden ? (
                  <span className="ml-1 flex items-center">
                    {Array(4)
                      .fill(0)
                      .map((_, i) => (
                        <Icon
                          key={i}
                          icon="uil:asterisk"
                          className="-mx-0.5 size-4"
                        />
                      ))}
                  </span>
                ) : (
                  numberToMoney(
                    +data[
                      `monthly${title}` as 'monthlyIncome' | 'monthlyExpenses'
                    ]
                  )
                )}
              </span>{' '}
              from this month
            </p>
          </div>
        </>
      )}
    </DashboardItem>
  )
}

export default IncomeExpenseCard
