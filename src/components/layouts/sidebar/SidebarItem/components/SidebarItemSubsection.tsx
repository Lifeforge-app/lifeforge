import { Icon } from '@iconify/react'

import React from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useLocation } from 'react-router-dom'
import { titleToPath, toCamelCase } from '@utils/strings'

function SidebarItemSubsection({
  subsection,
  name,
  sidebarExpanded,
  toggleSidebar,
  subsectionExpanded
}: {
  subsection: string[][]
  name: string
  sidebarExpanded: boolean
  toggleSidebar: () => void
  subsectionExpanded: boolean
}): React.ReactElement {
  const { t } = useTranslation('common.sidebar')
  const location = useLocation()

  return (
    <li
      className={`flex h-auto shrink-0 flex-col gap-2 overflow-hidden px-4 transition-all ${
        subsectionExpanded ? 'max-h-[1000px] py-2' : 'max-h-0 py-0'
      }`}
    >
      <ul
        className={`flex w-full flex-col items-center rounded-md ${
          !sidebarExpanded ? 'bg-bg-800' : ''
        }`}
      >
        {subsection.map(([subsectionName, subsectionIcon, subsectionLink]) => (
          <Link
            key={subsectionName}
            className={`mx-4 flex w-full items-center ${
              !sidebarExpanded ? 'justify-center' : ''
            } gap-4 rounded-lg py-4 ${
              sidebarExpanded ? 'pl-[3.8rem]' : 'px-2'
            } font-medium transition-all hover:bg-bg-100/50 dark:hover:bg-bg-800/50  ${
              location.pathname.split('/').slice(1)[0] === titleToPath(name) &&
              (location.pathname.split('/').slice(1)[1] === subsectionLink ||
                (location.pathname
                  .replace(titleToPath(name), '')
                  .replace(/\//g, '') === '' &&
                  subsectionName === 'Dashboard'))
                ? 'bg-bg-200/30 shadow-custom dark:bg-bg-800'
                : 'text-bg-500'
            }`}
            to={`./${titleToPath(name)}/${subsectionLink}`}
            onClick={() => {
              if (window.innerWidth < 1024) {
                toggleSidebar()
              }
            }}
          >
            <div className="flex size-7 items-center justify-center">
              <Icon className="size-6" icon={subsectionIcon} />
            </div>

            {sidebarExpanded && (
              <span className="w-full truncate pr-4">
                {t(
                  `modules.${toCamelCase(name)}.subsections.${toCamelCase(
                    subsectionName
                  )}`
                )}{' '}
              </span>
            )}
          </Link>
        ))}
      </ul>
    </li>
  )
}

export default SidebarItemSubsection
