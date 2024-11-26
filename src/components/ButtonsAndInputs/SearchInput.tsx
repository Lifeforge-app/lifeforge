import { Icon } from '@iconify/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import useThemeColors from '@hooks/useThemeColor'
import { toCamelCase } from '@utils/strings'

function SearchInput({
  searchQuery,
  setSearchQuery,
  stuffToSearch,
  onKeyUp,
  customIcon,
  lighter = false,
  hasTopMargin = true,
  onFilterIconClick,
  filterAmount
}: {
  searchQuery: string
  setSearchQuery: (query: string) => void
  stuffToSearch: string
  onKeyUp?: (e: React.KeyboardEvent<HTMLInputElement>) => void
  customIcon?: string
  lighter?: boolean
  hasTopMargin?: boolean
  onFilterIconClick?: () => void
  filterAmount?: number
}): React.ReactElement {
  const { t } = useTranslation()
  const { componentBgWithHover } = useThemeColors()

  return (
    <search
      className={`flex h-14 w-full cursor-text items-center gap-4 rounded-lg bg-bg-50 px-4 shadow-custom transition-all hover:!bg-white/70 ${
        lighter
          ? 'dark:bg-bg-800/50 dark:hover:bg-bg-800'
          : componentBgWithHover
      } ${hasTopMargin ? 'mt-4' : ''}`}
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
      {onFilterIconClick !== undefined && (
        <button
          onClick={onFilterIconClick}
          className={`flex items-center gap-1 rounded-lg p-2 ${
            filterAmount !== undefined && filterAmount > 0
              ? 'text-bg-900 dark:text-bg-100'
              : 'text-bg-500 hover:text-bg-900 dark:hover:text-bg-100'
          } transition-all hover:bg-bg-200 dark:hover:bg-bg-700/50`}
        >
          <Icon icon="tabler:filter" className="text-xl" />
          {filterAmount !== undefined && filterAmount > 0 && (
            <span className="-mt-0.5">({filterAmount})</span>
          )}
        </button>
      )}
    </search>
  )
}

export default SearchInput
