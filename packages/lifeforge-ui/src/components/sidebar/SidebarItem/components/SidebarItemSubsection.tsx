import clsx from 'clsx'
import { useSidebarState } from 'shared/lib'

import SidebarSubsectionItem from './SidebarSubsectionItem'

function SidebarItemSubsection({
  subsection,
  name,
  subsectionExpanded
}: {
  subsection: {
    name: string
    icon: string | React.ReactElement
    path: string
  }[]
  name: string
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
          !sidebarExpanded && 'bg-bg-800'
        )}
      >
        {subsection.map(({ name: subsectionName, icon, path }) => (
          <SidebarSubsectionItem
            key={subsectionName}
            icon={icon}
            name={name}
            path={path}
            subsectionName={subsectionName}
          />
        ))}
      </ul>
    </li>
  )
}

export default SidebarItemSubsection
