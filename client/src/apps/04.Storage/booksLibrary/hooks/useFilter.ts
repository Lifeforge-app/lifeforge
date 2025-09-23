import {
  parseAsBoolean,
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
  useQueryState,
  useQueryStates
} from 'nuqs'
import { useEffect, useState } from 'react'

export default function useFilter() {
  const [searchQuery, setSearchQuery] = useQueryState(
    'q',
    parseAsString.withDefault('')
  )

  const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1))

  const [initialLoading, setInitialLoading] = useState(true)

  const [filter, setFilter] = useQueryStates({
    collection: parseAsString.withDefault(''),
    fileType: parseAsString.withDefault(''),
    language: parseAsString.withDefault(''),
    favourite: parseAsBoolean.withDefault(false),
    readStatus: parseAsStringEnum(['', '1', '2', '3']).withDefault('')
  })

  useEffect(() => {
    if (page !== 1 && !initialLoading) setPage(1)
    if (initialLoading) setInitialLoading(false)
  }, [filter, searchQuery])

  const updateFilter = (
    key: keyof typeof filter,
    value: string | boolean | null
  ) => {
    setFilter(prev => ({
      ...prev,
      [key]: value
    }))
  }

  return {
    searchQuery,
    setSearchQuery,
    page,
    setPage,
    ...filter,
    updateFilter
  }
}
