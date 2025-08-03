import { Icon } from '@iconify/react'
import clsx from 'clsx'

function FilterChip({
  icon,
  text,
  color,
  onRemove
}: {
  icon: string
  text: string
  color?: string
  onRemove: () => void
}) {
  return (
    <span
      className={clsx(
        'flex-center shadow-custom gap-1 rounded-full px-2 py-1 text-sm',
        color === undefined &&
          `text-bg-500 dark:text-bg-400 component-bg-lighter`
      )}
      style={
        color !== undefined ? { backgroundColor: color + '20', color } : {}
      }
    >
      <Icon className="size-4" icon={icon} />
      {text}
      <button onClick={onRemove}>
        <Icon className="size-4" icon="tabler:x" />
      </button>
    </span>
  )
}

export default FilterChip
