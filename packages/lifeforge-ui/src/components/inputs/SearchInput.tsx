import { Icon } from '@iconify/react'
import { useDebounce } from '@uidotdev/usehooks'
import clsx from 'clsx'
import _ from 'lodash'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

import Button from './Button'

interface SearchInputProps {
  /** The icon to display in the search input. Should be a valid icon name from Iconify. */
  icon?: string
  /** The current search query value of the input field. */
  value: string
  /** Callback function called when the search query changes. */
  onChange: (query: string) => void
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
  /** Optional debounce delay in milliseconds. When set, the onChange callback will be debounced by this amount. */
  debounceMs?: number
}

/**
 * SearchInput component for entering search queries.
 */
function SearchInput({
  icon = 'tabler:search',
  value,
  onChange,
  searchTarget,
  actionButtonProps,
  onKeyUp,
  className,
  namespace,
  debounceMs
}: SearchInputProps) {
  const { t } = useTranslation([
    'common.misc',
    ...(namespace ? [namespace] : [])
  ])

  // Internal state for immediate input feedback when debouncing
  const [internalValue, setInternalValue] = useState(value)

  const debouncedValue = useDebounce(internalValue, debounceMs ?? 0)

  // Track if we have a pending debounce to avoid syncing back from parent
  const isPendingDebounce = useRef(false)

  // Sync internal value when external value changes (only if not pending our own debounce)
  useEffect(() => {
    if (!isPendingDebounce.current) {
      setInternalValue(value)
    }
  }, [value])

  // Call onChange with debounced value when it changes
  useEffect(() => {
    if (debounceMs && isPendingDebounce.current) {
      isPendingDebounce.current = false
      onChange(debouncedValue)
    }
  }, [debouncedValue, debounceMs, onChange])

  const displayValue = debounceMs ? internalValue : value

  const handleChange = (newValue: string) => {
    if (debounceMs) {
      isPendingDebounce.current = true
      setInternalValue(newValue)
    } else {
      onChange(newValue)
    }
  }

  const handleClear = () => {
    isPendingDebounce.current = false

    if (debounceMs) {
      setInternalValue('')
    }
    onChange('')
  }

  return (
    <search
      className={clsx(
        'shadow-custom border-bg-500/20 component-bg-with-hover relative flex min-h-14 w-full cursor-text items-center gap-3 rounded-lg p-4 transition-all in-[.bordered]:border-2',
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
          actionButtonProps ? 'pr-20' : 'pr-10'
        )}
        placeholder={t([`search`, `Search ${searchTarget}`], {
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
        value={displayValue}
        onChange={e => {
          handleChange(e.target.value)
        }}
        onKeyUp={onKeyUp}
      />
      <div className="absolute top-1/2 right-4 flex -translate-y-1/2 items-center gap-2">
        <Button
          className={clsx(
            'size-8 p-0',
            displayValue ? 'visible opacity-100' : 'invisible opacity-0'
          )}
          icon="tabler:x"
          variant="plain"
          onClick={handleClear}
        />
        {actionButtonProps && (
          <Button
            {...actionButtonProps}
            className={clsx('size-8 p-0', actionButtonProps.className)}
            variant={actionButtonProps.variant || 'plain'}
          />
        )}
      </div>
    </search>
  )
}

export default SearchInput
