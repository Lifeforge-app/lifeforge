import clsx from 'clsx'
import { memo, useMemo } from 'react'

interface InputLabelProps {
  label: string
  active: boolean
  focused?: boolean
  isCombobox?: boolean
  isListboxOrCombobox?: boolean
  required?: boolean
}

function InputLabel({
  label,
  active,
  focused,
  isListboxOrCombobox = false,
  isCombobox = false,
  required = false
}: InputLabelProps) {
  const labelPositionClasses = useMemo(() => {
    if (!active) {
      return `top-1/2 -translate-y-1/2 ${
        isListboxOrCombobox
          ? `${isCombobox && 'group-focus-within:top-5 group-focus-within:text-[14px]'} group-data-open:top-5 group-data-open:text-[14px]`
          : 'group-focus-within:top-5 group-focus-within:text-[14px]'
      }`
    }

    return 'top-5 -translate-y-1/2 text-[14px]'
  }, [active, isListboxOrCombobox, isCombobox])

  return (
    <span
      className={clsx(
        'text-bg-500 group-focus-within:text-custom-500! group-data-open:text-custom-500! pointer-events-none absolute left-[4.2rem] font-medium tracking-wide transition-all',
        focused && 'text-custom-500',
        labelPositionClasses
      )}
    >
      {label}
      {required && <span className="text-red-500"> *</span>}
    </span>
  )
}

export default memo(InputLabel)
