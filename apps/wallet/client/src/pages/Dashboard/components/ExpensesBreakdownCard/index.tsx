import { useWalletData } from '@/hooks/useWalletData'
import useYearMonthOptions from '@/hooks/useYearMonthOptions'
import forgeAPI from '@/utils/forgeAPI'
import { Icon } from '@iconify/react'
import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { DashboardItem, Listbox, ListboxOption, WithQuery } from 'lifeforge-ui'
import { createContext, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import type { InferOutput } from 'shared'

import type { WalletCategory } from '../../../Transactions'
import BreakdownChartLegend from './components/BreakdownChartLegend'
import BreakdownDetails from './components/BreakdownDetails'
import BreakdownDoughnutChart from './components/BreakdownDoughnutChart'

export const ExpensesBreakdownContext = createContext<{
  spentOnEachCategory: InferOutput<
    typeof forgeAPI.wallet.utils.getExpensesBreakdown
  >
  expensesCategories: WalletCategory[]
}>({
  spentOnEachCategory: {},
  expensesCategories: []
})

function ExpensesBreakdownCard() {
  const { t } = useTranslation('common.misc')

  const { categoriesQuery } = useWalletData()

  const [year, setYear] = useState(dayjs().year())

  const [month, setMonth] = useState(dayjs().month())

  const { yearsOptions, monthsOptions } = useYearMonthOptions(year)

  const expensesBreakdownQuery = useQuery(
    forgeAPI.wallet.utils.getExpensesBreakdown
      .input({ year: year.toString(), month: (month + 1).toString() })
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

  useEffect(() => {
    if (yearsOptions.length > 0) {
      setYear(yearsOptions[0])
    }
  }, [yearsOptions])

  useEffect(() => {
    if (monthsOptions.length > 0) {
      setMonth(monthsOptions[0])
    }
  }, [monthsOptions])

  return (
    <ExpensesBreakdownContext value={memoizedContextValue}>
      <DashboardItem
        className="col-span-1 row-span-4"
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
        <div className="mb-2 flex flex-col items-center gap-2 sm:flex-row">
          <Listbox
            buttonContent={
              <div className="flex items-center gap-3">
                <Icon className="text-bg-500 size-6" icon="tabler:calendar" />
                {t('dates.months.' + month)}
              </div>
            }
            className="flex-1"
            setValue={setMonth}
            value={month}
          >
            {monthsOptions.map(option => (
              <ListboxOption
                key={option}
                label={t('dates.months.' + option)}
                value={option}
              />
            ))}
          </Listbox>
          <Listbox
            buttonContent={
              <div className="flex items-center gap-3">{year}</div>
            }
            className="sm:w-36!"
            setValue={setYear}
            value={year}
          >
            {yearsOptions.map(option => (
              <ListboxOption
                key={option}
                label={option.toString()}
                value={option}
              />
            ))}
          </Listbox>
        </div>
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
