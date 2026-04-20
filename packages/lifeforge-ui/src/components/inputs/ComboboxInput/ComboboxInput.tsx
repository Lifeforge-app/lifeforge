import {
  ComboboxButton,
  ComboboxInput as HeadlessComboboxInput
} from '@headlessui/react'
import { Icon } from '@iconify/react'
import { useCallback, useMemo } from 'react'

import { Box, Flex, Text } from '@components/primitives'

import InputActionButton from '../shared/components/InputActionButton'
import InputIcon from '../shared/components/InputIcon'
import InputLabel from '../shared/components/InputLabel'
import useInputLabel from '../shared/hooks/useInputLabel'
import { autoFocusableRef } from '../shared/utils/autoFocusableRef'
import ComboboxInputWrapper from './components/ComboboxInputWrapper'
import ComboboxOptions from './components/ComboboxOptions'

interface ComboboxInputProps<T> {
  /** The style type of the input field. 'classic' shows label and icon with underline, 'plain' is a simple rounded box. */
  variant?: 'classic' | 'plain'
  /** The label text displayed above the combobox field. Required for 'classic' style. */
  label?: string
  /** The icon to display in the combobox. Should be a valid icon name from Iconify. Required for 'classic' style. */
  icon?: string
  /** The current selected value of the combobox. */
  value: T
  /** Callback function called when the selected value changes. */
  onChange: (value: T) => void
  /** Callback function called when the search query changes. */
  onQueryChanged: (query: string) => void
  /** Function that returns the display text for a given value. */
  displayValue: (value: T) => string
  /** Whether the combobox is required for form validation. */
  required?: boolean
  /** Whether the combobox is disabled and non-interactive. */
  disabled?: boolean
  /** Whether the input should automatically focus when rendered. */
  autoFocus?: boolean
  /** The dropdown options to display in the combobox. */
  children: React.ReactNode
  /** Whether the combobox should show as active regardless of focus state. */
  forcedActiveWhen?: boolean
  /** Additional CSS class names to apply to the combobox. Use `!` suffix for Tailwind CSS class overrides. */
  className?: string
  /** The i18n namespace for internationalization. See the [main documentation](https://docs.lifeforge.melvinchia.dev) for more details. */
  namespace?: string
}

function ComboboxInput<T>({
  variant = 'classic',
  label,
  icon,
  value,
  onChange,
  onQueryChanged: setQuery,
  displayValue,
  required = false,
  disabled = false,
  autoFocus = false,
  children,
  forcedActiveWhen: customActive,
  className,
  namespace
}: ComboboxInputProps<T>) {
  const inputLabel = useInputLabel({ namespace, label: label ?? '' })

  const isActive = useMemo(() => {
    if (typeof customActive === 'boolean') {
      return customActive
    }

    if (Array.isArray(value)) {
      return value.length > 0
    }

    if (typeof value === 'number') {
      return true
    }

    return !!value
  }, [value, customActive])

  const focusInput = useCallback((e: React.MouseEvent | React.FocusEvent) => {
    if ((e.target as HTMLElement).tagName === 'BUTTON') {
      return
    }

    const inputInside = (e.target as HTMLElement).querySelector('input') as
      | HTMLInputElement
      | HTMLTextAreaElement

    if (inputInside && inputInside instanceof HTMLInputElement) {
      inputInside.focus()
    }
  }, [])

  const handleChange = useCallback(
    (value: T | null) => {
      if (value !== null) {
        onChange(value)
      }
    },
    [onChange]
  )

  return (
    <ComboboxInputWrapper
      className={className}
      disabled={disabled}
      setQuery={setQuery}
      value={value}
      variant={variant}
      onChange={handleChange}
      onClick={focusInput}
    >
      <Flex align="center" className="group" position="relative" width="100%">
        {variant === 'classic' && icon && (
          <Box position="absolute">
            <InputIcon active={isActive} icon={icon} />
          </Box>
        )}
        {variant === 'classic' && label && (
          <Box
            asChild
            style={{
              marginLeft: 'calc(var(--spacing) * 14)'
            }}
          >
            <InputLabel
              isCombobox
              isListboxOrCombobox
              active={isActive}
              label={inputLabel}
              required={required === true}
            />
          </Box>
        )}
        <Box
          asChild
          bg="transparent"
          mt={variant === 'classic' ? 'md' : undefined}
          overflow="hidden"
          pb={variant === 'classic' ? 'sm' : undefined}
          position="relative"
          pr="3xl"
          pt={variant === 'classic' ? 'md' : undefined}
          rounded="lg"
          style={
            variant === 'classic'
              ? { paddingLeft: '3.5rem' }
              : {
                  paddingTop: '1.25rem',
                  paddingBottom: '1.25rem',
                  paddingLeft: '1.25rem'
                }
          }
          width="100%"
        >
          <Text asChild truncate align="left">
            <HeadlessComboboxInput
              ref={autoFocusableRef(autoFocus)}
              displayValue={displayValue}
              onChange={e => {
                setQuery(e.target.value)
              }}
            />
          </Text>
        </Box>
        <Box asChild mr={variant === 'plain' ? 'sm' : 'md'}>
          <InputActionButton asChild icon="" variant={variant}>
            <ComboboxButton>
              <Icon
                icon="heroicons:chevron-up-down-16-solid"
                style={{ width: '1.25em', height: '1.25em' }}
              />
            </ComboboxButton>
          </InputActionButton>
        </Box>
      </Flex>
      <ComboboxOptions>{children}</ComboboxOptions>
    </ComboboxInputWrapper>
  )
}

export default ComboboxInput
