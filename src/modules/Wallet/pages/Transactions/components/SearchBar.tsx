import React from 'react'

import { SearchInput, ViewModeSelector } from '@lifeforge/ui'

import { useWalletContext } from '@modules/Wallet/providers/WalletProvider'

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
        namespace="modules.wallet"
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        stuffToSearch="transaction"
      />
      <ViewModeSelector
        className="hidden md:flex"
        options={[
          { value: 'table', icon: 'tabler:table' },
          { value: 'list', icon: 'uil:list-ul' }
        ]}
        setViewMode={setView}
        viewMode={view}
      />
    </div>
  )
}

export default SearchBar
