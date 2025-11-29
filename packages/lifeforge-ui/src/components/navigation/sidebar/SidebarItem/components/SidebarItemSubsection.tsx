import clsx from 'clsx'
import { useSidebarState } from 'shared'

import SidebarSubsectionItem from './SidebarSubsectionItem'

function SidebarItemSubsection({
  subsection,
  label,
  subsectionExpanded
}: {
  subsection: {
    label: string
    icon: string | React.ReactElement
    path: string
  }[]
  label: string | React.ReactElement
  subsectionExpanded: boolean
}) {
  const { sidebarExpanded } = useSidebarState()

  return (
    <li
      className={clsx(
        'flex h-auto shrink-0 flex-col gap-2 overflow-hidden px-4 transition-all',
        subsectionExpanded ? 'max-h-[1000px] py-2' : 'max-h-0 py-0'
      )}
    >
      <ul
        className={clsx(
          'flex w-full flex-col items-center rounded-md',
          !sidebarExpanded && 'bg-bg-100 dark:bg-bg-800'
        )}
      >
        {subsection.map(({ label: subsectionLabel, icon, path }) => (
          <SidebarSubsectionItem
            key={subsectionLabel}
            icon={icon}
            label={label}
            path={path}
            subsectionLabel={subsectionLabel}
          />
        ))}
      </ul>
    </li>
  )
}

export default SidebarItemSubsection
