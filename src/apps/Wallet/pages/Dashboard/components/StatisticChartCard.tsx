import clsx from 'clsx'
import moment from 'moment'
import { useMemo } from 'react'
import { Bar } from 'react-chartjs-2'
import { useTranslation } from 'react-i18next'

import {
  APIFallbackComponent,
  DashboardItem,
  EmptyStateScreen
} from '@lifeforge/ui'

import { useWalletContext } from '@apps/Wallet/providers/WalletProvider'

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

function StatisticChardCard() {
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
  const { t } = useTranslation('apps.wallet')

  return (
    <DashboardItem
      className="col-span-2 row-span-2"
      componentBesideTitle={
        <div className="hidden items-center gap-8 sm:flex">
          {['income', 'expenses'].map(type => (
            <div key={type} className="flex items-center gap-2">
              <span
                className={clsx(
                  '-mb-0.5 size-3 rounded-full',
                  type === 'income' ? 'bg-green-500' : 'bg-red-500'
                )}
              />
              <span className="text-sm">{t(`transactionTypes.${type}`)}</span>
            </div>
          ))}
        </div>
      }
      icon="tabler:chart-dots"
      namespace="apps.wallet"
      title="Statistics"
    >
      <div className="flex-center size-full min-h-0 flex-1">
        <APIFallbackComponent data={transactions}>
          {transactions =>
            transactions.length === 0 ? (
              <EmptyStateScreen name="transactions" namespace="apps.wallet" />
            ) : (
              <Bar
                className="w-full"
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
              />
            )
          }
        </APIFallbackComponent>
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
