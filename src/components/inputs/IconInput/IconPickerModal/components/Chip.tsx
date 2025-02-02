import { Icon } from '@iconify/react'
import React from 'react'

function Chip({
  text,
  icon,
  selected,
  onClick
}: {
  text?: string
  icon?: string
  selected: boolean
  onClick: () => void
}): React.ReactElement {
  return (
    <button
      className={`${
        selected
          ? 'bg-custom-500! font-semibold text-bg-50 shadow-xs dark:text-bg-800'
          : 'bg-bg-50 hover:bg-bg-100 dark:bg-bg-800 dark:hover:bg-bg-700/70'
      } flex-center h-8 grow gap-2 cursor-pointer whitespace-nowrap rounded-full px-6 text-sm shadow-sm transition-all duration-100 md:grow-0`}
      type="button"
      onClick={onClick}
    >
      {icon !== undefined && <Icon className="size-5" icon={icon} />}
      {text}
    </button>
  )
}

export default Chip
