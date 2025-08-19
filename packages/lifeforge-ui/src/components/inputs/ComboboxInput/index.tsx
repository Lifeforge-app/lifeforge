import { ComboboxInput as HeadlessComboboxInput } from '@headlessui/react'
import { useCallback, useMemo } from 'react'

import InputIcon from '../shared/components/InputIcon'
import InputLabel from '../shared/components/InputLabel'
import useInputLabel from '../shared/hooks/useInputLabel'
import { autoFocusableRef } from '../shared/utils/autoFocusableRef'
import ComboboxInputWrapper from './components/ComboboxInputWrapper'
import ComboboxOptions from './components/ComboboxOptions'

interface ComboboxInputProps<T> {
  /** The label text displayed above the combobox field. */
  label: string
  /** The icon to display in the combobox. Should be a valid icon name from Iconify. */
  icon: string
  /** The current selected value of the combobox. */
  value: T
  /** Callback function called when the selected value changes. */
  setValue: (value: T) => void
  /** Callback function called when the search query changes. */
  setQuery: (query: string) => void
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
  customActive?: boolean
  /** Additional CSS class names to apply to the combobox. Use `!` suffix for Tailwind CSS class overrides. */
  className?: string
  /** The i18n namespace for internationalization. See the [main documentation](https://docs.lifeforge.melvinchia.dev) for more details. */
  namespace?: string
}

function ComboboxInput<T>({
  label,
  icon,
  value,
  setValue,
  setQuery,
  displayValue,
  required = false,
  disabled = false,
  autoFocus = false,
  children,
  customActive,
  className,
  namespace
}: ComboboxInputProps<T>) {
  const inputLabel = useInputLabel({ namespace, label })

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
    <ComboboxInputWrapper
      className={className}
      disabled={disabled}
      setQuery={setQuery}
      value={value}
      onChange={setValue}
      onClick={focusInput}
    >
      <div className="group relative flex w-full items-center">
        <InputIcon active={isActive} className="absolute left-6" icon={icon} />
        <InputLabel
          isCombobox
          isListboxOrCombobox
          active={isActive}
          label={inputLabel}
          required={required === true}
        />
        <HeadlessComboboxInput
          ref={autoFocusableRef(autoFocus)}
          className="relative mt-10 mb-3 flex w-full items-center gap-2 rounded-lg bg-transparent! pr-5 pl-17 text-left focus:outline-hidden"
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
