import { Icon } from '@iconify/react'
import clsx from 'clsx'
import React from 'react'

function SidebarItemSubsectionExpandIcon({
  toggleSubsection,
  subsectionExpanded
}: {
  toggleSubsection: () => void
  subsectionExpanded: boolean
}): React.ReactElement {
  return (
    <div className="flex-between relative flex">
      <button
        className="hover:bg-bg-100 dark:hover:bg-bg-700/50 rounded-full p-1"
        onClick={toggleSubsection}
      >
        <Icon
          className={clsx(
            'text-bg-500 stroke-[2px] transition-all',
            subsectionExpanded && 'rotate-90'
          )}
          icon="tabler:chevron-right"
        />
      </button>
    </div>
  )
}

export default SidebarItemSubsectionExpandIcon
