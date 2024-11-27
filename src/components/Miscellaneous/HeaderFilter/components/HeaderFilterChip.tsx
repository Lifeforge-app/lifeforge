import { Icon } from '@iconify/react'
import React from 'react'
import useThemeColors from '@hooks/useThemeColor'

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
}): React.ReactElement {
  const { componentBgLighter } = useThemeColors()

  return (
    <span
      className={`flex-center flex gap-1 rounded-full px-2 py-1 text-sm ${
        color === undefined &&
        `text-bg-500 dark:text-bg-400 ${componentBgLighter}`
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

export default FilterChip
