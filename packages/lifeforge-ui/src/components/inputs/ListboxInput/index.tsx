import { Icon } from '@iconify/react/dist/iconify.js'
import * as Select from '@radix-ui/react-select'
import { useCallback, useMemo } from 'react'

import InputIcon from '../shared/components/InputIcon'
import InputLabel from '../shared/components/InputLabel'
import useInputLabel from '../shared/hooks/useInputLabel'
import ListboxInputWrapper from './components/ListboxInputWrapper'
import ListboxOptions from './components/ListboxOptions'

interface ListboxInputProps<T> {
  /** The label text displayed above the listbox field. */
  label: string
  /** The icon to display in the listbox button. Should be a valid icon name from Iconify. */
  icon: string
  /** The current selected value of the listbox. */
  value: T
  /** Callback function called when the selected value changes. */
  setValue: (value: T) => void
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
}

function ListboxInput<T>({
  label,
  icon,
  value,
  setValue,
  required,
  disabled,
  multiple,
  className,
  children,
  customActive,
  buttonContent,
  namespace
}: ListboxInputProps<T>) {
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
    <ListboxInputWrapper
      className={className}
      disabled={disabled}
      multiple={multiple}
      value={value}
      onChange={setValue}
      onClick={focusInput}
    >
      <Select.Trigger className="group flex w-full min-w-64 items-center pl-6">
        <InputIcon active={isActive} icon={icon} />
        <InputLabel
          isListboxOrCombobox
          active={isActive}
          label={inputLabel}
          required={required === true}
        />
        <div className="relative mt-10 mb-3 flex min-h-[1.2rem] w-full items-center gap-2 rounded-lg pr-18 pl-5 text-left focus:outline-hidden">
          {isActive && buttonContent}
        </div>
        <span className="pointer-events-none absolute inset-y-0 right-0 mt-1 mr-2 flex items-center pr-4">
          <Select.Icon asChild>
            <Icon
              className="text-bg-500 group-data-open:text-bg-800 dark:group-data-open:text-bg-100 size-6"
              icon="heroicons:chevron-up-down-16-solid"
            />
          </Select.Icon>
        </span>
      </Select.Trigger>
      <ListboxOptions>{children}</ListboxOptions>
    </ListboxInputWrapper>
  )
}

export default ListboxInput
