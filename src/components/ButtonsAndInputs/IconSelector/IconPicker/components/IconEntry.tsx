import { Icon } from '@iconify/react/dist/iconify.js'
import React from 'react'

function IconEntry({
  icon,
  iconSet,
  setSelectedIcon,
  setOpen
}: {
  icon: string
  iconSet: string
  setSelectedIcon: (icon: string) => void
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}): React.ReactElement {
  return (
    <button
      type="button"
      onClick={() => {
        setSelectedIcon(`${iconSet}:${icon}`)
        setOpen(false)
      }}
      className="flex h-min w-full cursor-pointer flex-col items-center rounded-lg p-4 transition-all hover:bg-bg-200/70 dark:hover:bg-bg-800"
    >
      <Icon icon={`${iconSet}:${icon}`} width="32" height="32" />
      <p className="-mb-0.5 mt-4 break-all  text-center text-xs font-medium tracking-wide">
        {icon.replace(/-/g, ' ')}
      </p>
    </button>
  )
}

export default IconEntry
