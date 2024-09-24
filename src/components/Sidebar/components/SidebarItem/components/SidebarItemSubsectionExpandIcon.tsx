import { Icon } from '@iconify/react/dist/iconify.js'
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
        onClick={toggleSubsection}
        className="rounded-full p-1 hover:bg-bg-100 dark:hover:bg-bg-700/50"
      >
        <Icon
          icon="tabler:chevron-right"
          className={`stroke-[2px] text-bg-500 transition-all ${
            subsectionExpanded ? 'rotate-90' : ''
          }`}
        />
      </button>
    </div>
  )
}

export default SidebarItemSubsectionExpandIcon
