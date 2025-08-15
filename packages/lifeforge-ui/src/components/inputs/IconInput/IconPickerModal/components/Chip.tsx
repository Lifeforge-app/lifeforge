import { Icon } from '@iconify/react'
import clsx from 'clsx'

function Chip({
  label,
  icon,
  selected,
  onClick
}: {
  label?: string
  icon?: string
  selected: boolean
  onClick: () => void
}) {
  return (
    <button
      className={clsx(
        selected
          ? 'bg-custom-500! text-bg-50 dark:text-bg-800 font-semibold shadow-xs'
          : 'bg-bg-50 hover:bg-bg-100 dark:bg-bg-800 dark:hover:bg-bg-700/70',
        'flex-center h-8 grow cursor-pointer gap-2 rounded-full px-6 text-sm whitespace-nowrap shadow-sm transition-all duration-100 md:grow-0'
      )}
      type="button"
      onClick={onClick}
    >
      {icon !== undefined && <Icon className="size-5" icon={icon} />}
      {label}
    </button>
  )
}

export default Chip
