import { SearchInput } from '@lifeforge/ui'

import useFilter from '@/hooks/useFilter'

function SearchBar() {
  const { searchQuery, setSearchQuery } = useFilter()

  return (
    <SearchInput
      debounceMs={300}
      mt="md"
      searchTarget="transaction"
      value={searchQuery}
      onChange={setSearchQuery}
    />
  )
}

export default SearchBar
