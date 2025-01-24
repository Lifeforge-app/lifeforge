import React from 'react'

function InputLabel({
  label,
  active,
  isListbox = false,
  required
}: {
  label: string
  active: boolean
  isListbox?: boolean
  required: boolean
}): React.ReactElement {
  return (
    <span
      className={`pointer-events-none absolute left-[4.2rem] font-medium tracking-wide text-bg-500 transition-all ${
        isListbox
          ? 'group-data-[open]:!text-custom-500'
          : 'group-focus-within:!text-custom-500'
      } ${
        !active
          ? `top-1/2 -translate-y-1/2 ${
              isListbox
                ? 'group-data-[open]:top-5 group-data-[open]:text-[14px]'
                : 'group-focus-within:top-5 group-focus-within:text-[14px]'
            }`
          : 'top-5 -translate-y-1/2 text-[14px]'
      }`}
    >
      {label}
      {required && <span className="text-red-500"> *</span>}
    </span>
  )
}

export default InputLabel
