import { Icon } from '@iconify/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { toCamelCase } from '@utils/strings'

function SearchInput({
  searchQuery,
  setSearchQuery,
  stuffToSearch,
  onKeyUp,
  customIcon,
  lighter = false,
  hasTopMargin = true
}: {
  searchQuery: string
  setSearchQuery: (query: string) => void
  stuffToSearch: string
  onKeyUp?: (e: React.KeyboardEvent<HTMLInputElement>) => void
  customIcon?: string
  lighter?: boolean
  hasTopMargin?: boolean
}): React.ReactElement {
  const { t } = useTranslation()

  return (
    <search
      className={`flex w-full cursor-text items-center gap-4 rounded-lg p-4 shadow-custom transition-all ${
        lighter
          ? 'bg-white hover:bg-bg-50 dark:bg-bg-800/70 dark:hover:bg-bg-800'
          : 'bg-bg-50 hover:bg-bg-100 dark:bg-bg-900 dark:hover:bg-bg-800/70'
      } ${hasTopMargin ? 'mt-4 sm:mt-6' : ''}`}
      onClick={e => {
        e.currentTarget.querySelector('input')?.focus()
      }}
    >
      <Icon
        icon={customIcon ?? 'tabler:search'}
        className="size-5 text-bg-500"
      />
      <input
        type="text"
        onKeyUp={onKeyUp}
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
