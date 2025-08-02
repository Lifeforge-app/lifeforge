import { ComboboxInput as HeadlessComboboxInput } from '@headlessui/react'
import { useCallback, useMemo } from 'react'

import InputIcon from '../shared/components/InputIcon'
import InputLabel from '../shared/components/InputLabel'
import useInputLabel from '../shared/hooks/useInputLabel'
import ComboboxInputWrapper from './components/ComboboxInputWrapper'
import ComboboxOptions from './components/ComboboxOptions'

interface ComboboxInputProps<T> {
  label: string
  icon: string
  value: T
  setValue: (value: T) => void
  setQuery: (query: string) => void
  displayValue: (value: T) => string
  required?: boolean
  disabled?: boolean
  children: React.ReactNode
  customActive?: boolean
  className?: string
  namespace: string | false
  tKey?: string
}

function ComboboxInput<T>({
  label,
  icon,
  value,
  setValue,
  setQuery,
  displayValue,
  required,
  disabled,
  children,
  customActive,
  className,
  namespace,
  tKey
}: ComboboxInputProps<T>) {
  const inputLabel = useInputLabel(namespace, label, tKey)

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
