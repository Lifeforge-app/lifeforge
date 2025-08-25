import {
  parseAsBoolean,
  parseAsString,
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
    favourite: parseAsBoolean.withDefault(false)
  })

  const updateFilter = (key: keyof typeof filter, value: any) => {
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
