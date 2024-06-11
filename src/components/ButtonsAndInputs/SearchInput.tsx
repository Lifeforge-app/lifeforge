import { Icon } from '@iconify/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { toCamelCase } from '@utils/strings'

function SearchInput({
  searchQuery,
  setSearchQuery,
  stuffToSearch
}: {
  searchQuery: string
  setSearchQuery: (query: string) => void
  stuffToSearch: string
}): React.ReactElement {
  const { t } = useTranslation()

  return (
    <search className="mt-2 flex w-full items-center gap-4 rounded-lg bg-bg-50 p-4 shadow-custom dark:bg-bg-900 sm:mt-6">
      <Icon icon="tabler:search" className="size-5 text-bg-500" />
      <input
        type="text"
        value={searchQuery}
        onChange={e => {
          setSearchQuery(e.target.value)
        }}
        placeholder={t(`search.${toCamelCase(stuffToSearch)}`)}
        className="w-full bg-transparent placeholder:text-bg-500 focus:outline-none"
      />
    </search>
  )
}

export default SearchInput
