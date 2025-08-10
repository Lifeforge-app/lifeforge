import { Icon } from '@iconify/react'
import clsx from 'clsx'
import _ from 'lodash'
import { useTranslation } from 'react-i18next'

import { Button } from '../buttons'

function SearchInput({
  searchQuery,
  setSearchQuery,
  stuffToSearch,
  onKeyUp,
  customIcon,
  onFilterIconClick,
  filterAmount,
  sideButtonIcon,
  sideButtonLoading,
  onSideButtonClick,
  className,
  namespace,
  tKey = ''
}: {
  searchQuery: string
  setSearchQuery: (query: string) => void
  stuffToSearch: string
  onKeyUp?: (e: React.KeyboardEvent<HTMLInputElement>) => void
  customIcon?: string
  onFilterIconClick?: () => void
  filterAmount?: number
  sideButtonIcon?: string
  sideButtonLoading?: boolean
  onSideButtonClick?: () => void
  className?: string
  namespace: string | false
  tKey?: string
}) {
  const { t } = useTranslation([
    'common.misc',
    ...(namespace ? [namespace] : [])
  ])

  return (
    <search
      className={clsx(
        'shadow-custom component-bg-lighter-with-hover bg-bg-50 relative flex min-h-14 w-full cursor-text items-center gap-3 rounded-lg p-5 transition-all hover:bg-white',
        className
      )}
      onClick={e => {
        e.currentTarget.querySelector('input')?.focus()
      }}
    >
      <Icon
        className="text-bg-500 size-5 shrink-0"
        icon={customIcon ?? 'tabler:search'}
      />
      <input
        className="caret-custom-500 placeholder:text-bg-500 w-full bg-transparent"
        placeholder={t(`search`, {
          item: t([
            `${namespace}:${[tKey, 'items', _.camelCase(stuffToSearch)]
              .filter(e => e)
              .join('.')}`,
            stuffToSearch
          ])
        })}
        type="text"
        value={searchQuery}
        onChange={e => {
          setSearchQuery(e.target.value)
        }}
        onKeyUp={onKeyUp}
      />
      <div className="absolute top-1/2 right-4 flex -translate-y-1/2 items-center gap-2">
        {onFilterIconClick !== undefined && (
          <Button
            className="p-2!"
            icon="tabler:filter"
            onClick={onFilterIconClick}
          >
            {filterAmount !== undefined && filterAmount > 0 && (
              <span className="-mt-0.5">({filterAmount})</span>
            )}
          </Button>
        )}
        {sideButtonIcon !== undefined && onSideButtonClick !== undefined && (
          <Button
            className="p-2!"
            icon={sideButtonIcon}
            loading={sideButtonLoading}
            variant="plain"
            onClick={e => {
              e.stopPropagation()
              e.preventDefault()
              onSideButtonClick()
            }}
          />
        )}
      </div>
    </search>
  )
}

export default SearchInput
