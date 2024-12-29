import moment from 'moment'
import React, { useMemo } from 'react'
import { Bar } from 'react-chartjs-2'
import { useTranslation } from 'react-i18next'
import DashboardItem from '@components/Miscellaneous/DashboardItem'
import APIComponentWithFallback from '@components/Screens/APIComponentWithFallback'
import EmptyStateScreen from '@components/Screens/EmptyStateScreen'
import { useWalletContext } from '@providers/WalletProvider'

const options = {
  maintainAspectRatio: false,
  responsive: true,
  plugins: {
    legend: {
      display: false
    }
  },
  scales: {
    y: {
      display: true,
      type: 'logarithmic',
      min: 0.1,
      stacked: true
    },
    x: {
      display: true,
      stacked: true
    }
  },
  hover: {
    intersect: false
  }
}

function StatisticChardCard(): React.ReactElement {
  const { transactions } = useWalletContext()
  const dates = useMemo(() => {
    if (typeof transactions === 'string') {
      return []
    }

    return [
      ...new Set(
        transactions.map(transaction =>
          moment(transaction.date).format('MMM DD')
        )
      )
    ].reverse()
  }, [transactions])

  const groupedByDate = useMemo(() => {
    if (typeof transactions === 'string') {
      return [[], []]
    }

    return ['income', 'expenses'].map(type => {
      return dates
        .map(date =>
          transactions
            .filter(transaction => transaction.type === type)
            .filter(
              transaction => moment(transaction.date).format('MMM DD') === date
            )
            .reduce((acc, curr) => acc + curr.amount, 0)
        )
        .map(amount => (amount === 0 ? 0.1 : amount))
    })
  }, [transactions])
  const { t } = useTranslation()

  return (
    <DashboardItem
      className="col-span-2 row-span-2"
      icon="tabler:chart-dots"
      title={t('dashboard.widgets.statistics')}
      componentBesideTitle={
        <div className="hidden items-center gap-8 sm:flex">
          {['income', 'expenses'].map(type => (
            <div key={type} className="flex items-center gap-2">
              <span
                className={`-mb-0.5 size-3 rounded-full ${
                  type === 'income' ? 'bg-green-500' : 'bg-red-500'
                }`}
              ></span>
              <span className="text-sm">{t(`dashboard.widgets.${type}`)}</span>
            </div>
          ))}
        </div>
      }
    >
      <div className="flex-center mt-6 flex size-full min-h-0 flex-1">
        <APIComponentWithFallback data={transactions}>
          {transactions =>
            transactions.length === 0 ? (
              <EmptyStateScreen
                title={t('emptyState.wallet.transactions.title')}
                description={t('emptyState.wallet.transactions.description')}
              />
            ) : (
              <Bar
                data={{
                  labels: dates,
                  datasets: [
                    {
                      label: 'Income',
                      data: groupedByDate[0],
                      borderWidth: 1,
                      borderColor: 'rgb(34 197 94)',
                      backgroundColor: 'rgba(34,197,94,0.2)'
                    },
                    {
                      label: 'Expenses',
                      data: groupedByDate[1],
                      borderWidth: 1,
                      borderColor: 'rgb(239 68 68)',
                      backgroundColor: 'rgba(239,68,68,0.2)'
                    }
                  ]
                }}
                options={options as any}
                className="w-full"
              />
            )
          }
        </APIComponentWithFallback>
      </div>
      <div className="mt-4 flex items-center justify-center gap-8 sm:hidden">
        <div className="flex items-center gap-2">
          <span className="-mb-0.5 size-3 rounded-full bg-green-500"></span>
          <span className="text-sm">Income</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="-mb-0.5 size-3 rounded-full bg-red-500"></span>
          <span className="text-sm">Expenses</span>
        </div>
      </div>
    </DashboardItem>
  )
}

export default StatisticChardCard
