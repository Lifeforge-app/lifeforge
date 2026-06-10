import {
  ComboboxButton,
  ComboboxInput as HeadlessComboboxInput
} from '@headlessui/react'
import { useCallback, useMemo } from 'react'

import { Box, Flex, Icon, Text } from '@/components/primitives'

import { InputActionButton } from '../shared/components/InputActionButton'
import { InputIcon } from '../shared/components/InputIcon'
import { InputInnerWrapper } from '../shared/components/InputInnerWrapper'
import { InputLabel } from '../shared/components/InputLabel'
import { useInputLabel } from '../shared/hooks/useInputLabel'
import type { InputVariants } from '../shared/types'
import { autoFocusableRef } from '../shared/utils/autoFocusableRef'
import { ComboboxInputWrapper } from './components/ComboboxInputWrapper'
import { ComboboxOptions } from './components/ComboboxOptions'

interface ComboboxInputProps<T> {
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
  /** Error message to display when the input is invalid. */
  errorMsg?: string
}

export function ComboboxInput<T>({
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
  namespace,
  errorMsg
}: ComboboxInputProps<T> & InputVariants) {
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
      errorMsg={errorMsg}
      setQuery={setQuery}
      value={value}
      variant={variant}
      onChange={handleChange}
      onClick={focusInput}
    >
      <Flex align="center" position="relative" width="100%">
        {variant === 'classic' && icon && (
          <InputIcon active={isActive} hasError={!!errorMsg} icon={icon} />
        )}
        {variant === 'classic' && label && (
          <Box
            asChild
            style={{
              marginLeft: 'calc(var(--spacing) * 14)'
            }}
          >
            <InputLabel
              active={isActive}
              hasError={!!errorMsg}
              label={inputLabel}
              required={required === true}
            />
          </Box>
        )}
        <InputInnerWrapper
          hasActionButton
          mr="none"
          pr="none"
          variant={variant}
        >
          <Text asChild truncate align="left">
            <Box
              asChild
              p={variant === 'plain' ? 'md' : undefined}
              pr="3xl"
              width="100%"
            >
              <HeadlessComboboxInput
                ref={autoFocusableRef(autoFocus)}
                displayValue={displayValue}
                onChange={e => {
                  setQuery(e.target.value)

                  if (e.target.value === '') {
                    onChange(undefined as unknown as T)
                  }
                }}
              />
            </Box>
          </Text>
        </InputInnerWrapper>
      </Flex>
      <InputActionButton hasError={!!errorMsg} icon="" variant={variant}>
        <ComboboxButton>
          <Icon icon="heroicons:chevron-up-down-16-solid" size="1.25em" />
        </ComboboxButton>
      </InputActionButton>
      <ComboboxOptions>{children}</ComboboxOptions>
    </ComboboxInputWrapper>
  )
}
