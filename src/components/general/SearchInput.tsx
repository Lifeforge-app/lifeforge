import { Icon } from '@iconify/react'
import React from 'react'

function SearchInput({
  searchQuery,
  setSearchQuery,
  stuffToSearch
}: {
  searchQuery: string
  setSearchQuery: (query: string) => void
  stuffToSearch: string
}): React.ReactElement {
  return (
    <search className="mt-6 flex w-full items-center gap-4 rounded-lg bg-bg-50 p-4 shadow-[4px_4px_10px_0px_rgba(0,0,0,0.05)] dark:bg-bg-900">
      <Icon icon="tabler:search" className="h-5 w-5 text-bg-500" />
      <input
        type="text"
        value={searchQuery}
        onChange={e => {
          setSearchQuery(e.target.value)
        }}
        placeholder={`Search ${stuffToSearch} ...`}
        className="w-full bg-transparent placeholder:text-bg-500 focus:outline-none"
      />
    </search>
  )
}

export default SearchInput
