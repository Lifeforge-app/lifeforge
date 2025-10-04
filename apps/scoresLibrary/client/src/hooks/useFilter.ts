import {
  parseAsBoolean,
  parseAsInteger,
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
    category: parseAsString.withDefault(''),
    collection: parseAsString.withDefault(''),
    author: parseAsString.withDefault(''),
    starred: parseAsBoolean.withDefault(false),
    sort: parseAsStringEnum(['newest', 'oldest', 'author', 'name']).withDefault(
      'newest'
    ),
    view: parseAsStringEnum(['list', 'grid']).withDefault('grid'),
    page: parseAsInteger.withDefault(1)
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
