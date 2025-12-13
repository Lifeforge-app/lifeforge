import { ListboxButton } from '@headlessui/react'
import { Icon } from '@iconify/react'
import clsx from 'clsx'
import { useCallback, useMemo } from 'react'

import InputIcon from '../shared/components/InputIcon'
import InputLabel from '../shared/components/InputLabel'
import useInputLabel from '../shared/hooks/useInputLabel'
import ListboxInputWrapper from './components/ListboxInputWrapper'
import ListboxOptions from './components/ListboxOptions'

interface ListboxInputProps<T> {
  /** The style type of the input field. 'classic' shows label and icon with underline, 'plain' is a simple rounded box. */
  variant?: 'classic' | 'plain'
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
  buttonContent: React.ReactElement
  /** The i18n namespace for internationalization. See the [main documentation](https://docs.lifeforge.melvinchia.dev) for more details. */
  namespace?: string
  /** The error message to display when the field is invalid. */
  errorMsg?: string
}

function ListboxInput<T>({
  variant = 'classic',
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
  buttonContent,
  namespace,
  errorMsg
}: ListboxInputProps<T>) {
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
      value={value}
      variant={variant}
      onChange={onChange}
      onClick={focusInput}
    >
      <ListboxButton
        className={clsx(
          'group flex w-full items-center sm:min-w-64',
          variant === 'classic' ? 'pl-6' : ''
        )}
      >
        {variant === 'classic' && icon && (
          <InputIcon active={isActive} hasError={!!errorMsg} icon={icon} />
        )}
        {variant === 'classic' && label && (
          <InputLabel
            isListboxOrCombobox
            active={isActive}
            hasError={!!errorMsg}
            label={inputLabel}
            required={required === true}
          />
        )}
        <div
          className={clsx(
            'relative flex min-h-[1.2rem] w-full min-w-0 items-center gap-2 rounded-lg text-left focus:outline-hidden',
            variant === 'classic' ? 'mt-10 mb-3 pr-10 pl-5' : 'h-7 pr-8'
          )}
        >
          {variant === 'classic' ? isActive && buttonContent : buttonContent}
        </div>
        <span
          className={clsx(
            'pointer-events-none absolute inset-y-0 right-0 flex items-center',
            variant === 'classic' ? 'mt-1 mr-2 pr-4' : 'pr-2'
          )}
        >
          <Icon
            className="text-bg-400 dark:text-bg-600 group-data-open:text-bg-800 dark:group-data-open:text-bg-100 size-6"
            icon="heroicons:chevron-up-down-16-solid"
          />
        </span>
      </ListboxButton>
      <ListboxOptions portal={!multiple}>{children}</ListboxOptions>
    </ListboxInputWrapper>
  )
}

export default ListboxInput
