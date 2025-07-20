import { Icon } from '@iconify/react'
import dayjs from 'dayjs'
import { DashboardItem, QueryWrapper } from 'lifeforge-ui'
import { createContext, useMemo, useState } from 'react'
import { Link } from 'react-router'

import { useAPIQuery } from 'shared/lib'
import {
  ISchemaWithPB,
  WalletCollectionsSchemas
} from 'shared/types/collections'
import { WalletControllersSchemas } from 'shared/types/controllers'

import { useWalletData } from '@apps/Wallet/hooks/useWalletData'

import BreakdownChartLegend from './components/BreakdownChartLegend'
import BreakdownDetails from './components/BreakdownDetails'
import BreakdownDoughnutChart from './components/BreakdownDoughnutChart'

const ExpensesBreakdownContext = createContext<{
  spentOnEachCategory: WalletControllersSchemas.IUtils['getExpensesBreakdown']['response']
  expensesCategories: ISchemaWithPB<WalletCollectionsSchemas.ICategoryAggregated>[]
}>({
  spentOnEachCategory: {},
  expensesCategories: []
})

function ExpensesBreakdownCard() {
  const { categoriesQuery } = useWalletData()

  // TODO
  const [year] = useState(dayjs().year())

  const [month] = useState(dayjs().month() + 1)

  const expensesBreakdownQuery = useAPIQuery<
    WalletControllersSchemas.IUtils['getExpensesBreakdown']['response']
  >(`/wallet/utils/expenses-breakdown?year=${year}&month=${month}`, [
    'wallet',
    'expenses-breakdown',
    year,
    month
  ])

  const expensesCategories = useMemo(
    () =>
      Object.keys(expensesBreakdownQuery.data ?? {})
        .map(categoryId =>
          categoriesQuery.data?.find(category => category.id === categoryId)
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
        <QueryWrapper query={expensesBreakdownQuery}>
          {() => (
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
    </ExpensesBreakdownContext>
  )
}

export default ExpensesBreakdownCard
