import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'

import {
  EmptyStateScreen,
  LoadingScreen,
  Stack,
  WithQuery
} from '@lifeforge/ui'

import { type WalletCategory, useWalletData } from '@/hooks/useWalletData'
import useYearMonthState from '@/hooks/useYearMonthState'
import { forgeAPI } from '@/manifest'

import { CategoriesBreakdownContext } from '..'
import BreakdownChartLegend from './BreakdownChartLegend'
import BreakdownDetails from './BreakdownDetails'
import BreakdownDoughnutChart from './BreakdownDoughnutChart'
import BreakdownFilters from './BreakdownFilters'

function BreakdownContent({
  selectedType,
  setSelectedType
}: {
  selectedType: 'income' | 'expenses'
  setSelectedType: (type: 'income' | 'expenses') => void
}) {
  const { categoriesQuery } = useWalletData()

  const {
    yearMonth: { year, month },
    options: { years: yearsOptions, months: monthsOptions },
    setYearMonth,
    isLoading: isYearMonthLoading
  } = useYearMonthState(forgeAPI.analytics.getAvailableYearMonths)

  const categoriesBreakdownQuery = useQuery(
    forgeAPI.analytics.getCategoriesBreakdown
      .input({
        year: year?.toString() ?? '',
        month: ((month ?? 0) + 1).toString()
      })
      .queryOptions({
        enabled: year !== null && month !== null
      })
  )

  const currentBreakdown = categoriesBreakdownQuery.data?.[selectedType] ?? {}

  const filteredCategories = useMemo(
    () =>
      Object.keys(currentBreakdown)
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
    [categoriesQuery.data, currentBreakdown]
  )

  const memoizedContextValue = useMemo(() => {
    return {
      breakdown: currentBreakdown,
      categories: filteredCategories,
      type: selectedType,
      year,
      month
    }
  }, [currentBreakdown, filteredCategories, selectedType, year, month])

  if (isYearMonthLoading) {
    return <LoadingScreen />
  }

  // If no year or month options are available, obviously no data is available
  if (yearsOptions.length === 0 || monthsOptions.length === 0) {
    return (
      <EmptyStateScreen
        icon="tabler:wallet-off"
        message={{
          id: 'transactions'
        }}
      />
    )
  }

  return (
    <CategoriesBreakdownContext value={memoizedContextValue}>
      <Stack centered flex="1" gap="lg" minHeight="0">
        <BreakdownFilters
          month={month}
          monthsOptions={monthsOptions}
          selectedType={selectedType}
          setSelectedType={setSelectedType}
          setYearMonth={setYearMonth}
          year={year}
          yearsOptions={yearsOptions}
        />
        <WithQuery query={categoriesBreakdownQuery}>
          {data =>
            Object.keys(data[selectedType]).length === 0 ? (
              <EmptyStateScreen
                icon="tabler:wallet-off"
                message={{
                  id: 'transactions'
                }}
              />
            ) : (
              <>
                <BreakdownDoughnutChart />
                <BreakdownChartLegend />
                <BreakdownDetails />
              </>
            )
          }
        </WithQuery>
      </Stack>
    </CategoriesBreakdownContext>
  )
}

export default BreakdownContent
