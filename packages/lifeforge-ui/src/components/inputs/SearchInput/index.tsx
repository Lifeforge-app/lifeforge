import { Icon } from '@iconify/react'
import { useDebounce } from '@uidotdev/usehooks'
import clsx from 'clsx'
import _ from 'lodash'
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'
import { useDivSize } from 'shared'

import { Card } from '@components/layout'
import {
  Box,
  Flex,
  type FlexProps,
  Text,
  Transition
} from '@components/primitives'

import { Button } from '../Button'
import { Placeholder } from '../shared/components/Placeholder'
import * as styles from './SearchInput.css'

interface SearchInputProps extends Omit<FlexProps<'search'>, 'onChange'> {
  /** Whether the search input is disabled and non-interactive. */
  disabled?: boolean
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
export function SearchInput({
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
  disabled = false,
  children,
  ...props
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

  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({})

  useEffect(() => {
    const updatePosition = () => {
      if (!containerRef.current || !shouldShowChildren) return

      const rect = containerRef.current.getBoundingClientRect()

      setDropdownStyle({
        left: rect.left,
        top: rect.bottom + 8,
        width: rect.width
      })
    }

    updatePosition()

    window.addEventListener('scroll', updatePosition, true)
    window.addEventListener('resize', updatePosition)

    return () => {
      window.removeEventListener('scroll', updatePosition, true)
      window.removeEventListener('resize', updatePosition)
    }
  }, [shouldShowChildren])

  const handleBlur = (e: React.FocusEvent) => {
    if (
      containerRef.current &&
      !containerRef.current.contains(e.relatedTarget as Node) &&
      !childrenRef.current?.contains(e.relatedTarget as Node)
    ) {
      setIsFocused(false)
    }
  }

  return (
    <Box
      ref={containerRef}
      position="relative"
      width="100%"
      onBlur={handleBlur}
      onFocus={() => setIsFocused(true)}
    >
      <Flex
        shadow
        align="center"
        as="search"
        bg={{
          base: 'bg-50',
          dark: 'bg-900',
          hover: disabled ? undefined : 'bg-100',
          darkHover: disabled ? undefined : 'bg-800'
        }}
        className={clsx(styles.searchWrapper, className)}
        p="md"
        position="relative"
        rounded="lg"
        style={
          disabled
            ? {
                cursor: 'not-allowed',
                gap: '0.75rem',
                minHeight: '3.5rem',
                opacity: 0.5
              }
            : { cursor: 'text', gap: '0.75rem', minHeight: '3.5rem' }
        }
        width="100%"
        onClick={e => {
          if (disabled) return
          e.currentTarget.querySelector('input')?.focus()
        }}
        {...props}
      >
        <Box asChild flexShrink="0" height="1.25rem" width="1.25rem">
          <Text asChild color="muted">
            <Icon icon={icon} />
          </Text>
        </Box>
        <Placeholder>
          <input
            autoComplete="one-time-code"
            autoCorrect="off"
            className={styles.searchInput}
            data-form-type="other"
            data-lpignore="true"
            disabled={disabled}
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
          right="1rem"
          style={{ transform: 'translateY(-50%)' }}
          top="50%"
        >
          <Button
            disabled={disabled}
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
              disabled={disabled || actionButtonProps.disabled}
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
      {children &&
        createPortal(
          <Transition property="all">
            <Card
              height={shouldShowChildren ? `${childrenHeight}px` : '0'}
              overflow="hidden"
              p="none"
              position="fixed"
              style={{
                opacity: shouldShowChildren ? 1 : 0,
                pointerEvents: shouldShowChildren
                  ? ('auto' as const)
                  : ('none' as const),
                visibility: shouldShowChildren
                  ? ('visible' as const)
                  : ('hidden' as const),
                ...dropdownStyle
              }}
              zIndex="9999"
              onMouseDown={e => e.preventDefault()}
            >
              <Box ref={childrenRef} p="md">
                {children}
              </Box>
            </Card>
          </Transition>,
          document.body
        )}
    </Box>
  )
}

