import { useQuery } from '@tanstack/react-query'
import { useCallback, useEffect, useState } from 'react'

import type { ForgeEndpoint } from '@lifeforge/api'

interface YearMonth {
  year: number | null
  month: number | null
}

export default function useYearMonthState(controller: ForgeEndpoint) {
  const [yearMonth, setYearMonthState] = useState<YearMonth>({
    year: null,
    month: null
  })

  const yearMonthsQuery = useQuery<{
    years: number[]
    monthsByYear: Record<number, number[]>
  }>(controller.queryOptions() as any)

  const yearsOptions = yearMonthsQuery.data?.years ?? []

  const monthsOptions =
    yearMonth.year !== null
      ? (yearMonthsQuery.data?.monthsByYear[yearMonth.year] ?? [])
      : []

  useEffect(() => {
    if (yearsOptions.length > 0 && yearMonth.year === null) {
      setYearMonthState(prev => ({ ...prev, year: yearsOptions[0] }))
    }
  }, [yearsOptions, yearMonth.year])

  useEffect(() => {
    if (monthsOptions.length > 0 && yearMonth.month === null) {
      setYearMonthState(prev => ({ ...prev, month: monthsOptions[0] }))
    }
  }, [monthsOptions, yearMonth.month])

  useEffect(() => {
    if (
      yearMonth.year !== null &&
      yearMonth.month !== null &&
      monthsOptions.length > 0 &&
      !monthsOptions.includes(yearMonth.month)
    ) {
      setYearMonthState(prev => ({ ...prev, month: monthsOptions[0] }))
    }
  }, [yearMonth.year, yearMonth.month, monthsOptions])

  const setYearMonth = useCallback((update: Partial<YearMonth>) => {
    setYearMonthState(prev => ({ ...prev, ...update }))
  }, [])

  return {
    yearMonth,
    setYearMonth,
    options: {
      years: yearsOptions,
      months: monthsOptions
    },
    isLoading: yearMonthsQuery.isLoading
  }
}
