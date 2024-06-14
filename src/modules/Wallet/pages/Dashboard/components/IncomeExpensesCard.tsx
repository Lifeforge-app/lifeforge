import { Icon } from '@iconify/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { type IWalletIncomeExpenses } from '@interfaces/wallet_interfaces'
import { numberToMoney } from '@utils/strings'

function IncomeExpenseCard({
  title,
  icon,
  data
}: {
  title: string
  icon: string
  data: IWalletIncomeExpenses | 'loading' | 'error'
}): React.ReactElement {
  const isIncome = title.toLowerCase() === 'income'
  const { t } = useTranslation()

  return (
    <div className="col-span-1 row-span-1 flex flex-col justify-between gap-4 rounded-lg bg-bg-50 p-6 shadow-custom dark:bg-bg-900">
      <h1 className="flex items-center gap-2 text-xl font-semibold">
        <Icon icon={icon} className="text-2xl" />
        <span className="ml-2">
          {t(`dashboard.widgets.${isIncome ? 'income' : 'expenses'}`)}
        </span>
      </h1>
      {typeof data !== 'string' && (
        <>
          <p className="flex w-full items-end justify-start gap-2 text-5xl font-medium">
            <span className="-mb-0.5 text-2xl text-bg-500 xl:text-3xl">RM</span>
            {numberToMoney(
              +data[`total${title}` as 'totalIncome' | 'totalExpenses']
            )}
          </p>
          <p>
            <span className={isIncome ? 'text-green-500' : 'text-red-500'}>
              {isIncome ? '+' : '-'}RM
              {numberToMoney(
                +data[`monthly${title}` as 'monthlyIncome' | 'monthlyExpenses']
              )}
            </span>{' '}
            from this month
          </p>
        </>
      )}
    </div>
  )
}

export default IncomeExpenseCard
