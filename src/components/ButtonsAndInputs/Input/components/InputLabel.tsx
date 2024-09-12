import React from 'react'

function InputLabel({
  label,
  active
}: {
  label: string
  active: boolean
}): React.ReactElement {
  return (
    <span
      className={`pointer-events-none absolute left-[4.2rem] font-medium tracking-wide text-bg-500 transition-all group-focus-within:!text-custom-500 ${
        !active
          ? 'top-1/2 -translate-y-1/2 group-focus-within:top-6 group-focus-within:text-[14px]'
          : 'top-6 -translate-y-1/2 text-[14px]'
      }`}
    >
      {label}
    </span>
  )
}

export default InputLabel
