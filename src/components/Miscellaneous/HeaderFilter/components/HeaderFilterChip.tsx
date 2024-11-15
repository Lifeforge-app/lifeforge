import { Icon } from '@iconify/react/dist/iconify.js'
import React from 'react'

function HeaderFilterChip({
  icon,
  text,
  color,
  onRemove
}: {
  icon: string
  text: string
  color?: string
  onRemove: () => void
}): React.ReactElement {
  return (
    <span
      className={`flex-center flex gap-1 rounded-full px-2 py-1 text-sm ${
        color === undefined &&
        'bg-bg-200 text-bg-500 dark:bg-bg-800 dark:text-bg-400'
      }`}
      style={
        color !== undefined ? { backgroundColor: color + '20', color } : {}
      }
    >
      <Icon icon={icon} className="size-4" />
      {text}
      <button onClick={onRemove}>
        <Icon icon="tabler:x" className="size-4" />
      </button>
    </span>
  )
}

export default HeaderFilterChip
