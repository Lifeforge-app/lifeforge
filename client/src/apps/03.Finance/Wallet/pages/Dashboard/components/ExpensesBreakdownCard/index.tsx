import { Icon } from '@iconify/react'
import { useQuery } from '@tanstack/react-query'
import forgeAPI from '@utils/forgeAPI'
import dayjs from 'dayjs'
import { DashboardItem, WithQuery } from 'lifeforge-ui'
import { createContext, useMemo, useState } from 'react'
import { Link } from 'react-router'
import type { InferOutput } from 'shared'

import { useWalletData } from '@apps/03.Finance/wallet/hooks/useWalletData'
import type { WalletCategory } from '@apps/03.Finance/wallet/pages/Transactions'

import BreakdownChartLegend from './components/BreakdownChartLegend'
import BreakdownDetails from './components/BreakdownDetails'
import BreakdownDoughnutChart from './components/BreakdownDoughnutChart'

export const ExpensesBreakdownContext = createContext<{
  spentOnEachCategory: InferOutput<
    typeof forgeAPI.wallet.apps.getExpensesBreakdown
  >
  expensesCategories: WalletCategory[]
}>({
  spentOnEachCategory: {},
  expensesCategories: []
})

function ExpensesBreakdownCard() {
  const { categoriesQuery } = useWalletData()

  // TODO
  const [year] = useState(dayjs().year())

  const [month] = useState(dayjs().month() + 1)

  const expensesBreakdownQuery = useQuery(
    forgeAPI.wallet.apps.getExpensesBreakdown
      .input({ year: year.toString(), month: month.toString() })
      .queryOptions()
  )

  const expensesCategories = useMemo(
    () =>
      Object.keys(expensesBreakdownQuery.data ?? {})
        .map(
          categoryId =>
            categoriesQuery.data?.find(
              category => category.id === categoryId
            ) ||
            ({
              id: categoryId,
              name: categoryId,
              icon: 'tabler:category',
              color: '#000000'
            } as WalletCategory)
        )
        .filter(e => e),
    [categoriesQuery.data, expensesBreakdownQuery.data]
  )

  const memoizedContextValue = useMemo(() => {
    return {
      spentOnEachCategory: expensesBreakdownQuery.data ?? {},
      expensesCategories
    }
  }, [expensesBreakdownQuery.data, expensesCategories])

  return (
    <ExpensesBreakdownContext value={memoizedContextValue}>
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
        <WithQuery query={expensesBreakdownQuery}>
          {() => (
            <>
              <BreakdownDoughnutChart />
              <BreakdownChartLegend />
              <BreakdownDetails />
            </>
          )}
        </WithQuery>
      </DashboardItem>
    </ExpensesBreakdownContext>
  )
}

export default ExpensesBreakdownCard
