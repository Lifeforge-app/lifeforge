import clsx from 'clsx'
import dayjs from 'dayjs'
import { DashboardItem, EmptyStateScreen, WithQuery } from 'lifeforge-ui'
import { useMemo } from 'react'
import { Line } from 'react-chartjs-2'
import { useTranslation } from 'react-i18next'

import { useWalletData } from '@apps/03.Finance/wallet/hooks/useWalletData'

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
  const { transactionsQuery } = useWalletData()

  const { t } = useTranslation('apps.wallet')

  const transactions = transactionsQuery.data ?? []

  const dates = useMemo(() => {
    if (typeof transactions === 'string') {
      return []
    }

    return [
      ...new Set(
        transactions.map(transaction =>
          dayjs(transaction.date).format('MMM DD')
        )
      )
    ]
      .reverse()
      .slice(-30)
  }, [transactions])

  const getTransactions = (date: string, type: 'income' | 'expenses') =>
    transactions
      .filter(transaction => transaction.type === type)
      .filter(transaction => dayjs(transaction.date).format('MMM DD') === date)
      .reduce((acc, curr) => acc + curr.amount, 0)

  const groupedByDate = useMemo(() => {
    return (['income', 'expenses'] as const).map(type => {
      return dates
        .map(date => getTransactions(date, type))
        .map(amount => (amount === 0 ? 0.1 : amount))
    })
  }, [transactions])

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
        <WithQuery query={transactionsQuery}>
          {transactions =>
            transactions.length === 0 ? (
              <EmptyStateScreen name="transactions" namespace="apps.wallet" />
            ) : (
              <Line
                className="w-full"
                data={{
                  labels: dates,
                  datasets: [
                    {
                      label: 'Income',
                      data: groupedByDate[0],
                      borderWidth: 2,
                      borderColor: 'rgb(34 197 94)',
                      backgroundColor: 'rgba(34,197,94,0.2)'
                    },
                    {
                      label: 'Expenses',
                      data: groupedByDate[1],
                      borderWidth: 2,
                      borderColor: 'rgb(239 68 68)',
                      backgroundColor: 'rgba(239,68,68,0.2)'
                    }
                  ]
                }}
                options={options as any}
              />
            )
          }
        </WithQuery>
      </div>
      <div className="flex-center mt-4 gap-8 sm:hidden">
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
