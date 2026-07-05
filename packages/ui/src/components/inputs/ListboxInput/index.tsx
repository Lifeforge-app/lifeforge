import { ListboxButton } from '@headlessui/react'
import { useCallback, useMemo } from 'react'

import { Box, Flex, Text } from '@/components/primitives'

import { InputActionButton } from '../shared/components/InputActionButton'
import { InputIcon } from '../shared/components/InputIcon'
import { InputInnerWrapper } from '../shared/components/InputInnerWrapper'
import { InputLabel } from '../shared/components/InputLabel'
import { useInputLabel } from '../shared/hooks/useInputLabel'
import type { InputVariants } from '../shared/types'
import { ListboxInputWrapper } from './components/ListboxInputWrapper'
import { ListboxOptions } from './components/ListboxOptions'

interface ListboxInputProps<T> {
  /** The label text displayed above the listbox field. Required for 'classic' style. */
  label?: string
  /** The icon to display in the listbox button. Should be a valid icon name from Iconify. Required for 'classic' style. */
  icon?: string
  /** The current selected value of the listbox. */
  value: T
  /** Callback function called when the selected value changes. */
  onChange: (value: T) => void
  /** Whether the field is required for form validation. */
  required?: boolean
  /** Whether the listbox is disabled and non-interactive. */
  disabled?: boolean
  /** Whether the listbox allows multiple selections. */
  multiple?: boolean
  /** Additional CSS class names to apply to the listbox container. Use `!` suffix for Tailwind CSS class overrides. */
  className?: string
  /** The child elements to render as listbox options. */
  children: React.ReactNode
  /** Whether the listbox uses custom active state styling. */
  customActive?: boolean
  /** The custom content to display in the listbox button. */
  renderContent?: (value: T) => React.ReactNode
  /** The i18n namespace for internationalization. See the [main documentation](https://docs.lifeforge.melvinchia.dev) for more details. */
  namespace?: string | false
  /** The error message to display when the field is invalid. */
  errorMsg?: string
}

type ListboxInputPropsWithVariants<T> = ListboxInputProps<T> &
  InputVariants<true>

export function ListboxInput<T>({
  variant = 'classic',
  size = 'default',
  label,
  icon,
  value,
  onChange,
  required,
  disabled,
  multiple,
  className,
  children,
  customActive,
  renderContent,
  namespace,
  errorMsg
}: ListboxInputPropsWithVariants<T>) {
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

  return (
    <ListboxInputWrapper
      className={className}
      disabled={disabled}
      errorMsg={errorMsg}
      multiple={multiple}
      size={size}
      value={value}
      variant={variant}
      onChange={onChange}
      onClick={focusInput}
    >
      <Flex
        asChild
        align="center"
        minWidth="0"
        position="relative"
        width="100%"
      >
        <ListboxButton>
          <Flex
            align="center"
            minWidth="0"
            p={
              variant === 'plain' ? (size === 'small' ? 'xs' : 'md') : undefined
            }
            position="relative"
            width="100%"
          >
            {icon && (
              <InputIcon active={isActive} hasError={!!errorMsg} icon={icon} />
            )}
            {variant === 'classic' && label && (
              <Box
                asChild
                pr="3xl"
                style={{
                  paddingLeft: 'calc(var(--spacing) * 14)'
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
            <InputInnerWrapper hasActionButton variant={variant}>
              <Text asChild align="left">
                <Box minHeight="1.5em" minWidth="0" width="100%">
                  {variant === 'classic'
                    ? isActive && renderContent?.(value)
                    : renderContent?.(value)}
                </Box>
              </Text>
            </InputInnerWrapper>
          </Flex>
          <Box asChild mr="sm" position="absolute" right="0">
            <InputActionButton
              hasError={!!errorMsg}
              icon="heroicons:chevron-up-down-16-solid"
              style={{
                marginRight:
                  variant === 'classic'
                    ? '1em'
                    : size === 'small'
                      ? '0.25em'
                      : '0.75em'
              }}
              variant={variant}
            />
          </Box>
        </ListboxButton>
      </Flex>
      <ListboxOptions portal={!multiple}>{children}</ListboxOptions>
    </ListboxInputWrapper>
  )
}
