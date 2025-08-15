import { Icon } from '@iconify/react'
import clsx from 'clsx'
import _ from 'lodash'
import { useTranslation } from 'react-i18next'

import { Button } from '../buttons'

interface SearchInputProps {
  /** The icon to display in the search input. Should be a valid icon name from Iconify. */
  icon?: string
  /** The current search query value of the input field. */
  value: string
  /** Callback function called when the search query changes. */
  setValue: (query: string) => void
  /** The target or context being searched for accessibility and labeling purposes. */
  searchTarget: string
  /** Properties to construct the action button component at the right hand side of the searchbar. */
  actionButtonProps?: React.ComponentProps<typeof Button>
  /** Callback function called when a key is released in the input field. */
  onKeyUp?: (e: React.KeyboardEvent<HTMLInputElement>) => void
  /** Additional CSS class names to apply to the search input container. */
  className?: string
  /** The i18n namespace for internationalization. See the [main documentation](https://docs.lifeforge.melvinchia.dev) for more details. */
  namespace?: string
}

/**
 * SearchInput component for entering search queries.
 */
function SearchInput({
  icon = 'tabler:search',
  value,
  setValue,
  searchTarget,
  actionButtonProps,
  onKeyUp,
  className,
  namespace
}: SearchInputProps) {
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
      <Icon className="text-bg-500 size-5 shrink-0" icon={icon} />
      <input
        className={clsx(
          'caret-custom-500 placeholder:text-bg-500 w-full bg-transparent',
          actionButtonProps ? 'pr-12' : ''
        )}
        placeholder={t(`search`, {
          item: t([
            `${namespace}:items.${_.camelCase(searchTarget)}`,
            `${namespace}:items.${searchTarget}`,
            `${namespace}:${_.camelCase(searchTarget)}`,
            `${namespace}:${searchTarget}`,
            `common.misc:items.${_.camelCase(searchTarget)}`,
            `common.misc:items.${searchTarget}`,
            `common.misc:${_.camelCase(searchTarget)}`,
            `common.misc:${searchTarget}`,
            searchTarget
          ])
        })}
        type="text"
        value={value}
        onChange={e => {
          setValue(e.target.value)
        }}
        onKeyUp={onKeyUp}
      />
      <div className="absolute top-1/2 right-2 flex -translate-y-1/2 items-center gap-2">
        {actionButtonProps && <Button {...actionButtonProps} />}
      </div>
    </search>
  )
}

export default SearchInput
