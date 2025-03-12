import { Icon } from '@iconify/react'
import clsx from 'clsx'
import React from 'react'

import { DashboardItem } from '@lifeforge/ui'

import { useWalletContext } from '@modules/Wallet/providers/WalletProvider'

import { type Loadable } from '@interfaces/common'

import { type IWalletIncomeExpenses } from '../../../interfaces/wallet_interfaces'

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
      className="col-span-1 row-span-1"
      icon={icon}
      namespace="modules.wallet"
      title={isIncome ? 'income' : 'expenses'}
    >
      {typeof data !== 'string' && (
        <>
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
        </>
      )}
    </DashboardItem>
  )
}

export default IncomeExpenseCard
