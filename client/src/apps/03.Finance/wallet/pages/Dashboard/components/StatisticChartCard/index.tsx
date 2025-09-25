import { DashboardItem, EmptyStateScreen, WithQuery } from 'lifeforge-ui'
import { useState } from 'react'
import { Bar } from 'react-chartjs-2'
import { useTranslation } from 'react-i18next'

import { useWalletData } from '@apps/03.Finance/wallet/hooks/useWalletData'

import RangeSelector from './components/RangeSelector'
import { useChartData, useChartLabels, useChartOptions } from './hooks'

function StatisticChardCard() {
  const { transactionsQuery } = useWalletData()

  const { t } = useTranslation('apps.wallet')

  const [range, setRange] = useState<'week' | 'month' | 'ytd'>('week')

  const options = useChartOptions(range)

  const labels = useChartLabels(range)

  const data = useChartData(labels, range)

  return (
    <DashboardItem
      className="col-span-2 row-span-2 max-h-120"
      componentBesideTitle={
        <RangeSelector
          className="hidden w-72! sm:flex"
          range={range}
          setRange={setRange}
        />
      }
      icon="tabler:chart-dots"
      namespace="apps.wallet"
      title="Statistics"
    >
      <RangeSelector className="sm:hidden" range={range} setRange={setRange} />
      <div className="flex-center size-full min-h-0 flex-1">
        <WithQuery query={transactionsQuery}>
          {transactions =>
            transactions.length === 0 ? (
              <EmptyStateScreen name="transactions" namespace="apps.wallet" />
            ) : (
              <Bar
                className="w-full"
                data={{
                  labels: labels,
                  datasets: [
                    {
                      label: 'Income',
                      data: data[0],
                      borderWidth: 2,
                      borderColor: 'rgb(34 197 94)',
                      backgroundColor: 'rgba(34,197,94,0.2)'
                    },
                    {
                      label: 'Expenses',
                      data: data[1],
                      borderWidth: 2,
                      borderColor: 'rgb(239 68 68)',
                      backgroundColor: 'rgba(239,68,68,0.2)'
                    }
                  ]
                }}
                options={options}
              />
            )
          }
        </WithQuery>
      </div>
      <div className="flex-center gap-12">
        <div className="flex items-center gap-2">
          <span className="-mb-0.5 size-3 rounded-full bg-green-500"></span>
          <span className="text-sm">{t('transactionTypes.income')}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="-mb-0.5 size-3 rounded-full bg-red-500"></span>
          <span className="text-sm">{t('transactionTypes.expenses')}</span>
        </div>
      </div>
    </DashboardItem>
  )
}

export default StatisticChardCard
