import { SearchInput } from 'lifeforge-ui'

import { useWalletStore } from '@apps/Wallet/stores/useWalletStore'

function SearchBar() {
  const { searchQuery, setSearchQuery } = useWalletStore()

  return (
    <div className="flex items-center gap-2">
      <SearchInput
        className="mt-4"
        namespace="apps.wallet"
        searchTarget="transaction"
        setValue={setSearchQuery}
        value={searchQuery}
      />
    </div>
  )
}

export default SearchBar
