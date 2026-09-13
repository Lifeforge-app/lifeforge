import { parseAsString, useQueryState } from 'nuqs'

export default function useFilter() {
  const [searchQuery, setSearchQuery] = useQueryState(
    'q',
    parseAsString.withDefault('')
  )

  return {
    searchQuery,
    setSearchQuery
  }
}
