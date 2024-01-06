import { Icon } from '@iconify/react'
import React, { useContext, useState } from 'react'
import { GlobalStateContext } from '../../../providers/GlobalStateProvider'
import { useLocation } from 'react-router'
import { Link } from 'react-router-dom'

interface SidebarItemProps {
  icon: string
  name: string
  subsection?: string[][]
}

function SidebarItem({
  icon,
  name,
  subsection
}: SidebarItemProps): React.JSX.Element {
  const { sidebarExpanded } = useContext(GlobalStateContext)
  const [subsectionExpanded, setSubsectionExpanded] = useState(false)
  const location = useLocation()

  function toggleSubsection(): void {
    setSubsectionExpanded(!subsectionExpanded)
  }

  return (
    <>
      <li
        className={`relative flex items-center gap-6 px-4 font-medium transition-all ${
          location.pathname
            .slice(1)
            .startsWith(name.toLowerCase().replace(' ', '-'))
            ? "text-neutral-800 after:absolute after:right-0 after:top-1/2 after:h-8 after:w-1 after:-translate-y-1/2 after:rounded-full after:bg-teal-500 after:content-[''] dark:text-neutral-100"
            : 'text-neutral-500 dark:text-neutral-400'
        }`}
      >
        <Link
          to={`/${name.toLowerCase().replace(' ', '-')}`}
          className={`flex w-full items-center gap-6 whitespace-nowrap rounded-lg p-4 hover:bg-neutral-200/30 dark:hover:bg-neutral-800 ${
            location.pathname
              .slice(1)
              .startsWith(name.toLowerCase().replace(' ', '-'))
              ? 'bg-neutral-200/50 dark:bg-neutral-800'
              : ''
          }`}
        >
          <Icon icon={icon} className="h-6 w-6 shrink-0" />
          {sidebarExpanded && (
            <div className="flex w-full items-center justify-between">
              {name}
              {subsection !== undefined && (
                <button
                  onClick={toggleSubsection}
                  className="rounded-full p-1 hover:bg-neutral-700/50"
                >
                  <Icon
                    icon="tabler:chevron-right"
                    className={`stroke-[2px] text-neutral-400 transition-all ${
                      subsectionExpanded ? 'rotate-90' : ''
                    }`}
                  />
                </button>
              )}
            </div>
          )}
        </Link>
      </li>
      {subsection !== undefined && (
        <li
          className={`flex h-auto shrink-0 flex-col gap-2 overflow-hidden ${
            subsectionExpanded ? 'max-h-[1000px] py-2' : 'max-h-0 py-0'
          }`}
        >
          {subsection.map(([subsectionName, subsectionIcon]) => (
            <Link
              to={`/${name}#${subsectionName.toLowerCase().replace(' ', '-')}`}
              key={subsectionName}
              className={`mx-4 flex items-center gap-4 rounded-lg py-4 pl-[3.8rem] font-medium transition-all hover:bg-neutral-800 ${
                location.hash.slice(1) ===
                subsectionName.toLowerCase().replace(' ', '-')
                  ? 'bg-neutral-800'
                  : 'text-neutral-400'
              }`}
            >
              <Icon icon={subsectionIcon} className="h-6 w-6" />
              {subsectionName}
            </Link>
          ))}
        </li>
      )}
    </>
  )
}

export default SidebarItem
