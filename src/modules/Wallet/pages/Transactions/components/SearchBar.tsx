import React from 'react'
import SearchInput from '@components/ButtonsAndInputs/SearchInput'
import ViewModeSelector from '@components/Miscellaneous/ViewModeSelector'
import { useWalletContext } from '@providers/WalletProvider'

function SearchBar({
  setView,
  view
}: {
  setView: React.Dispatch<React.SetStateAction<'table' | 'list'>>
  view: 'table' | 'list'
}): React.ReactElement {
  const { searchQuery, setSearchQuery } = useWalletContext()

  return (
    <div className="flex items-center gap-2">
      <SearchInput
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        stuffToSearch="transactions"
      />
      <ViewModeSelector
        className="hidden md:flex"
        viewMode={view}
        setViewMode={setView}
        options={[
          { value: 'table', icon: 'tabler:table' },
          { value: 'list', icon: 'uil:list-ul' }
        ]}
      />
    </div>
  )
}

export default SearchBar
