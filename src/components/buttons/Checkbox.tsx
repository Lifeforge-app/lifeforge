import { Icon } from '@iconify/react/dist/iconify.js'
import React from 'react'

function Checkbox({
  checked,
  onChange,
  className
}: {
  checked: boolean
  onChange: (e: React.MouseEvent<HTMLButtonElement>) => void
  className?: string
}): React.ReactElement {
  return (
    <button
      className={`flex-center group relative cursor-pointer z-50 size-5 shrink-0 rounded-full ring-2 ring-offset-2 ring-offset-bg-50 transition-all dark:ring-offset-bg-900 ${
        checked
          ? 'ring-custom-500'
          : 'ring-bg-200 hover:ring-bg-600! dark:ring-bg-500 dark:hover:ring-bg-300!'
      } ${className}`}
      onClick={e => {
        e.preventDefault()
        e.stopPropagation()
        onChange(e)
      }}
    >
      <Icon
        className={`size-4 stroke-1 ${
          checked
            ? 'stroke-custom-500 text-custom-500'
            : 'stroke-bg-800 text-bg-800 opacity-0 group-hover:opacity-50 dark:stroke-bg-100 dark:text-bg-100'
        }`}
        icon="uil:check"
      />
    </button>
  )
}

export default Checkbox
