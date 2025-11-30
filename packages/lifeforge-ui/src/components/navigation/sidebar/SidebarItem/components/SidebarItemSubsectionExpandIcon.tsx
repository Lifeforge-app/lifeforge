import { Icon } from '@iconify/react'
import clsx from 'clsx'

function SidebarItemSubsectionExpandIcon({
  toggleSubsection,
  subsectionExpanded
}: {
  toggleSubsection: () => void
  subsectionExpanded: boolean
}) {
  return (
    <div className="flex-between relative flex">
      <button
        className="hover:bg-bg-100 dark:hover:bg-bg-700/50 rounded-full p-1"
        onClick={e => {
          e.stopPropagation()
          toggleSubsection()
        }}
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
