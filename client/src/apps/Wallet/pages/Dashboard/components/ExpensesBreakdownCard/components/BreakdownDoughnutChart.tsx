import { Icon } from '@iconify/react'
import clsx from 'clsx'
import { useContext } from 'react'
import { Doughnut } from 'react-chartjs-2'
import { useTranslation } from 'react-i18next'

import { useWalletStore } from '@apps/Wallet/stores/useWalletStore'
import numberToCurrency from '@apps/Wallet/utils/numberToCurrency'

import { ExpensesBreakdownContext } from '..'

const CHART_OPTIONS = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    }
  },
  cutout: '80%'
}

function BreakdownDoughnutChart() {
  const { t } = useTranslation('apps.wallet')

  const { isAmountHidden } = useWalletStore()

  const { spentOnEachCategory, expensesCategories } = useContext(
    ExpensesBreakdownContext
  )

  return (
    <div className="relative mx-auto flex aspect-square w-4/5 min-w-0 flex-col gap-3">
      <div className="absolute top-1/2 left-1/2 mt-2 flex size-full -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center">
        <div
          className={clsx(
            'flex text-3xl font-medium',
            isAmountHidden ? 'items-center' : 'items-end'
          )}
        >
          <span className="text-bg-500 mr-1 text-xl">RM</span>
          {isAmountHidden ? (
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
            numberToCurrency(
              Object.values(spentOnEachCategory).reduce(
                (acc, curr) => acc + curr.amount,
                0
              )
            )
          )}
        </div>
        <div className="text-bg-500 mt-2 w-1/2 text-center text-sm sm:text-base">
          {t('widgets.expensesBreakdown.thisMonthsSpending')}
        </div>
      </div>
      <Doughnut
        className="relative aspect-square w-full min-w-0"
        data={{
          labels: expensesCategories?.map(category => category?.name),
          datasets: [
            {
              label: 'Monies spent',
              data:
                expensesCategories?.map(
                  category => spentOnEachCategory?.[category?.id]?.amount || 0
                ) ?? [],
              backgroundColor: expensesCategories?.map(
                category => category?.color + '20'
              ),
              borderColor: expensesCategories?.map(category => category?.color),
              borderWidth: 1
            }
          ]
        }}
        options={CHART_OPTIONS}
      />
    </div>
  )
}

export default BreakdownDoughnutChart
