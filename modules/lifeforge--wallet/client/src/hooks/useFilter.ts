import {
  parseAsInteger,
  parseAsString,
  useQueryState,
  useQueryStates
} from 'nuqs'
import { useEffect, useState } from 'react'

export default function useFilter() {
  const [searchQuery, setSearchQuery] = useQueryState(
    'q',
    parseAsString.withDefault('')
  )

  const [filter, setFilter] = useQueryStates({
    type: parseAsString.withDefault(''),
    category: parseAsString.withDefault(''),
    asset: parseAsString.withDefault(''),
    ledger: parseAsString.withDefault(''),
    startDate: parseAsString.withDefault(''),
    endDate: parseAsString.withDefault('')
  })

  const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1))
  const [initialLoading, setInitialLoading] = useState(true)

  useEffect(() => {
    if (page !== 1 && !initialLoading) setPage(1)
    if (initialLoading) setInitialLoading(false)
  }, [filter, searchQuery])

  const updateFilter = (key: keyof typeof filter, value: any) => {
    setFilter(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const setFilters = (updates: Partial<typeof filter>) => {
    setFilter(prev => ({
      ...prev,
      ...updates
    }))
  }

  return {
    searchQuery,
    setSearchQuery,
    ...filter,
    page,
    setPage,
    updateFilter,
    setFilters
  }
}
