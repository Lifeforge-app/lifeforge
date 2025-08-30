import {
  parseAsBoolean,
  parseAsString,
  parseAsStringEnum,
  useQueryState,
  useQueryStates
} from 'nuqs'

export default function useFilter() {
  const [searchQuery, setSearchQuery] = useQueryState(
    'q',
    parseAsString.withDefault('')
  )

  const [filter, setFilter] = useQueryStates({
    collection: parseAsString.withDefault(''),
    fileType: parseAsString.withDefault(''),
    language: parseAsString.withDefault(''),
    favourite: parseAsBoolean.withDefault(false),
    readStatus: parseAsStringEnum(['', '1', '2', '3']).withDefault('')
  })

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
    ...filter,
    updateFilter
  }
}
