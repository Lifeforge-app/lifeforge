import { ComboboxInput as HeadlessComboboxInput } from '@headlessui/react'
import clsx from 'clsx'
import { useCallback, useMemo } from 'react'

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
      variant={variant}
      value={value}
      onChange={handleChange}
      onClick={focusInput}
    >
      <div className="group relative flex w-full items-center">
        {variant === 'classic' && icon && (
          <InputIcon
            active={isActive}
            className="absolute left-6"
            icon={icon}
          />
        )}
        {variant === 'classic' && label && (
          <InputLabel
            isCombobox
            isListboxOrCombobox
            active={isActive}
            label={inputLabel}
            required={required === true}
          />
        )}
        <HeadlessComboboxInput
          ref={autoFocusableRef(autoFocus)}
          className={clsx(
            'relative flex w-full items-center gap-2 rounded-lg bg-transparent! text-left focus:outline-hidden',
            variant === 'classic' ? 'mt-10 mb-3 pr-5 pl-17' : 'h-7 p-0'
          )}
          displayValue={displayValue}
          onChange={e => {
            setQuery(e.target.value)
          }}
        />
      </div>
      <ComboboxOptions>{children}</ComboboxOptions>
    </ComboboxInputWrapper>
  )
}

export default ComboboxInput
