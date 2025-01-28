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
      type="button"
      onClick={onClick}
      className={`${
        selected
          ? 'bg-custom-500! font-semibold text-bg-50 shadow-xs dark:text-bg-800'
          : 'bg-bg-50 hover:bg-white/70! dark:bg-bg-800 dark:hover:bg-bg-700/70'
      } flex-center h-8 grow gap-2 whitespace-nowrap rounded-full px-6 text-sm shadow-sm transition-all duration-100 md:grow-0`}
    >
      {icon !== undefined && <Icon icon={icon} className="size-5" />}
      {text}
    </button>
  )
}

export default Chip
