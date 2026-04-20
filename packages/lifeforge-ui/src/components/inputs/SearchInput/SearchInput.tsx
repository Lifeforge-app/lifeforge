import { Icon } from '@iconify/react'
import { useDebounce } from '@uidotdev/usehooks'
import clsx from 'clsx'
import _ from 'lodash'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDivSize } from 'shared'

import { Card } from '@components/layout'
import { Box, Flex, Text } from '@components/primitives'

import Button from '../Button'
import Placeholder from '../shared/components/Placeholder'
import * as styles from './SearchInput.css'

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
  /** Policy for showing children components.
   * - "always": Always show children components below the search input.
   * - "input-focus": Only show children components when the search input is focused.
   * - "query-not-empty": Only show children components when the search query is not empty.
   * - "input-focus-query-not-empty": Show children components when the search input is focused and the query is not empty.
   *
   * @default "query-not-empty"
   */
  showChildrenPolicy?:
    | 'always'
    | 'input-focus'
    | 'query-not-empty'
    | 'input-focus-query-not-empty'
  /** Child components to render below the search input, typically used for displaying search results or suggestions. */
  children?: React.ReactNode
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
  debounceMs,
  showChildrenPolicy = 'query-not-empty',
  children
}: SearchInputProps) {
  const { t } = useTranslation([
    'common.misc',
    ...(namespace ? [namespace] : [])
  ])

  // Internal state for immediate input feedback when debouncing
  const [internalValue, setInternalValue] = useState(value)

  const [isFocused, setIsFocused] = useState(false)

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

  const shouldShowChildren = (() => {
    switch (showChildrenPolicy) {
      case 'always':
        return true
      case 'input-focus':
        return isFocused
      case 'query-not-empty':
        return displayValue.length > 0
      case 'input-focus-query-not-empty':
        return isFocused && displayValue.length > 0
    }
  })()

  const containerRef = useRef<HTMLDivElement>(null)

  const childrenRef = useRef<HTMLDivElement>(null)

  const { height: childrenHeight } = useDivSize(childrenRef)

  const handleBlur = (e: React.FocusEvent) => {
    // Check if the new focus target is still within our container
    if (
      containerRef.current &&
      !containerRef.current.contains(e.relatedTarget as Node)
    ) {
      setIsFocused(false)
    }
  }

  return (
    <Box
      ref={containerRef}
      onBlur={handleBlur}
      onFocus={() => setIsFocused(true)}
      position="relative"
      width="100%"
    >
      <Flex
        shadow
        align="center"
        as="search"
        bg={{
          base: 'bg-50',
          dark: 'bg-900',
          hover: 'bg-100',
          darkHover: 'bg-800'
        }}
        className={clsx(styles.searchWrapper, className)}
        onClick={e => {
          e.currentTarget.querySelector('input')?.focus()
        }}
        p="md"
        position="relative"
        rounded="lg"
        style={{ cursor: 'text', gap: '0.75rem', minHeight: '3.5rem' }}
        width="100%"
      >
        <Text
          asChild
          color="bg-500"
          style={{ flexShrink: 0, height: '1.25rem', width: '1.25rem' }}
        >
          <Icon icon={icon} />
        </Text>
        <Placeholder>
          <input
            autoComplete="one-time-code"
            autoCorrect="off"
            className={styles.searchInput}
            data-form-type="other"
            data-lpignore="true"
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
            style={{ paddingRight: actionButtonProps ? '5rem' : '2.5rem' }}
            type="text"
            value={displayValue}
            onChange={e => {
              handleChange(e.target.value)
            }}
            onKeyUp={onKeyUp}
          />
        </Placeholder>
        <Flex
          align="center"
          gap="sm"
          position="absolute"
          style={{ right: '1rem', top: '50%', transform: 'translateY(-50%)' }}
        >
          <Button
            icon="tabler:x"
            style={{
              height: '2rem',
              opacity: displayValue ? 1 : 0,
              padding: 0,
              visibility: displayValue ? 'visible' : 'hidden',
              width: '2rem'
            }}
            variant="plain"
            onClick={handleClear}
          />
          {actionButtonProps && (
            <Button
              {...actionButtonProps}
              style={{
                height: '2rem',
                padding: 0,
                width: '2rem',
                ...actionButtonProps.style
              }}
              variant={actionButtonProps.variant || 'plain'}
            />
          )}
        </Flex>
      </Flex>
      {children && (
        <Card
          overflow="hidden"
          style={{
            height: children && shouldShowChildren ? childrenHeight : 0,
            opacity: shouldShowChildren ? 1 : 0,
            padding: 0,
            pointerEvents: shouldShowChildren ? undefined : 'none',
            position: 'absolute',
            top: '0.5rem',
            transition: 'all 0.2s',
            visibility: shouldShowChildren ? 'visible' : 'hidden'
          }}
          width="100%"
          onMouseDown={e => e.preventDefault()}
        >
          <Box ref={childrenRef} p="md">
            {children}
          </Box>
        </Card>
      )}
    </Box>
  )
}

export default SearchInput
