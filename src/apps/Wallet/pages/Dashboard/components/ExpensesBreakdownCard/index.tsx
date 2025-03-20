import { Icon } from '@iconify/react'
import dayjs from 'dayjs'
import { useMemo, useState } from 'react'
import { Link } from 'react-router'

import { DashboardItem, QueryWrapper } from '@lifeforge/ui'

import { IWalletCategory } from '@apps/Wallet/interfaces/wallet_interfaces'
import { useWalletContext } from '@apps/Wallet/providers/WalletProvider'

import useAPIQuery from '@hooks/useAPIQuery'

import BreakdownChartLegend from './components/BreakdownChartLegend'
import BreakdownDetails from './components/BreakdownDetails'
import BreakdownDoughnutChart from './components/BreakdownDoughnutChart'

function ExpensesBreakdownCard() {
  const { categoriesQuery } = useWalletContext()
  // TODO
  const [year] = useState(dayjs().year())
  const [month] = useState(dayjs().month() + 1)
  const expensesBreakdownQuery = useAPIQuery<
    Record<
      string,
      {
        amount: number
        count: number
        percentage: number
      }
    >
  >(`/wallet/utils/expenses-breakdown?year=${year}&month=${month}`, [
    'wallet',
    'expenses-breakdown',
    year,
    month
  ])

  const expensesCategories = useMemo(
    () =>
      Object.keys(expensesBreakdownQuery.data ?? {}).map(
        categoryId =>
          categoriesQuery.data?.find(
            category => category.id === categoryId
          ) as IWalletCategory
      ),
    [categoriesQuery.data, expensesBreakdownQuery.data]
  )

  return (
    <DashboardItem
      className="col-span-1 row-span-3"
      componentBesideTitle={
        <Link
          className="text-bg-500 hover:bg-bg-100 hover:text-bg-800 dark:hover:bg-bg-700/30 dark:hover:text-bg-50 flex items-center gap-2 rounded-lg p-2 font-medium transition-all"
          to="/wallet/transactions?type=expenses"
        >
          <Icon className="text-xl" icon="tabler:chevron-right" />
        </Link>
      }
      icon="tabler:chart-donut-3"
      namespace="apps.wallet"
      title="Expenses Breakdown"
    >
      <QueryWrapper query={expensesBreakdownQuery}>
        {data => (
          <>
            <BreakdownDoughnutChart
              expensesCategories={expensesCategories}
              spentOnEachCategory={data}
            />
            <BreakdownChartLegend expensesCategories={expensesCategories} />
            <BreakdownDetails
              expensesCategories={expensesCategories}
              spentOnEachCategory={data}
            />
          </>
        )}
      </QueryWrapper>
    </DashboardItem>
  )
}

export default ExpensesBreakdownCard
