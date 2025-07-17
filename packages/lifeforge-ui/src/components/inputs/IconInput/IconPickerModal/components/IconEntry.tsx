import { Icon } from '@iconify/react'
import { useCallback } from 'react'

function IconEntry({
  icon,
  iconSet,
  onIconSelected
}: {
  icon: string
  iconSet: string
  onIconSelected: (icon: string) => void
}) {
  const handleIconSelected = useCallback(() => {
    onIconSelected(`${iconSet}:${icon}`)
  }, [icon])

  return (
    <button
      className="hover:bg-bg-200/70 dark:hover:bg-bg-800 flex h-min w-full cursor-pointer flex-col items-center rounded-lg p-4 transition-all"
      type="button"
      onClick={handleIconSelected}
    >
      <Icon height="32" icon={`${iconSet}:${icon}`} width="32" />
      <p className="-mb-0.5 mt-4 break-all text-center text-xs font-medium tracking-wide">
        {icon.replace(/-/g, ' ')}
      </p>
    </button>
  )
}

export default IconEntry
