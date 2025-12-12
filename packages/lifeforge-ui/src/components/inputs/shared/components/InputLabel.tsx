import clsx from 'clsx'
import { memo, useMemo } from 'react'

interface InputLabelProps {
  label: string
  active: boolean
  focused?: boolean
  isCombobox?: boolean
  isListboxOrCombobox?: boolean
  required?: boolean
  hasError?: boolean
}

function InputLabel({
  label,
  active,
  focused,
  isListboxOrCombobox = false,
  isCombobox = false,
  required = false,
  hasError = false
}: InputLabelProps) {
  const labelPositionClasses = useMemo(() => {
    if (!active) {
      return `top-1/2 -translate-y-1/2 text-sm ${
        isListboxOrCombobox
          ? `${isCombobox && 'group-focus-within:top-5 group-focus-within:text-base'} group-data-open:top-5 group-data-open:text-base`
          : 'group-focus-within:top-5 group-focus-within:text-base'
      }`
    }

    return 'top-5 -translate-y-1/2 text-base'
  }, [active, isListboxOrCombobox, isCombobox])

  return (
    <span
      className={clsx(
        'pointer-events-none absolute left-17 font-medium tracking-wide transition-all',
        hasError
          ? 'text-red-500 group-focus-within:text-red-500! group-data-open:text-red-500!'
          : focused
            ? 'text-custom-500'
            : 'text-bg-500 group-focus-within:text-custom-500! group-data-open:text-custom-500!',
        labelPositionClasses
      )}
    >
      {label}
      {required && <span className="text-red-500"> *</span>}
    </span>
  )
}

export default memo(InputLabel)
