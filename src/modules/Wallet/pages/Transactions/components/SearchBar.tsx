import { Icon } from '@iconify/react'
import React from 'react'
import SearchInput from '@components/ButtonsAndInputs/SearchInput'
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
      <div className="mt-2 flex items-center gap-2 rounded-md bg-bg-50 p-2 shadow-custom dark:bg-bg-900 sm:mt-6">
        {['list', 'table'].map(viewType => (
          <button
            key={viewType}
            onClick={() => {
              setView(viewType as 'table' | 'list')
            }}
            className={`flex items-center gap-2 rounded-md p-2 transition-all ${
              viewType === view
                ? 'bg-bg-200/50 dark:bg-bg-800'
                : 'text-bg-500 hover:text-bg-800 dark:hover:text-bg-100'
            }`}
          >
            <Icon
              icon={
                viewType === 'table'
                  ? 'tabler:table'
                  : viewType === 'list'
                  ? 'uil:list-ul'
                  : ''
              }
              className="size-6"
            />
          </button>
        ))}
      </div>
    </div>
  )
}

export default SearchBar
