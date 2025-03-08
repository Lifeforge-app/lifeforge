import clsx from 'clsx'
import React, { useMemo } from 'react'

interface InputLabelProps {
  label: string
  active: boolean
  isCombobox?: boolean
  isListboxOrCombobox?: boolean
  required?: boolean
}

const InputLabel: React.FC<InputLabelProps> = ({
  label,
  active,
  isListboxOrCombobox = false,
  isCombobox = false,
  required = false
}) => {
  const labelPositionClasses = useMemo(() => {
    if (!active) {
      return `top-1/2 -translate-y-1/2 ${
        isListboxOrCombobox
          ? `${isCombobox && "group-focus-within:top-5 group-focus-within:text-[14px]"} group-data-open:top-5 group-data-open:text-[14px]`
          : 'group-focus-within:top-5 group-focus-within:text-[14px]'
      }`
    }
    return 'top-5 -translate-y-1/2 text-[14px]'
  }, [active, isListboxOrCombobox, isCombobox])

  const labelColorClasses = useMemo(
    () =>
      isListboxOrCombobox
        ? 'group-data-open:text-custom-500!'
        : 'group-focus-within:text-custom-500!',
    [isListboxOrCombobox]
  )

  return (
    <span
      className={clsx(
        'pointer-events-none absolute left-[4.2rem] font-medium tracking-wide text-bg-500 transition-all',
        labelColorClasses,
        labelPositionClasses
      )}
    >
      {label}
      {required && <span className="text-red-500"> *</span>}
    </span>
  )
}

export default InputLabel
