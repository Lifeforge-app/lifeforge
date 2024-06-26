import { Icon } from '@iconify/react'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router'
import { Link } from 'react-router-dom'
import { useGlobalStateContext } from '@providers/GlobalStateProvider'
import { titleToPath, toCamelCase } from '../../../utils/strings'

interface SidebarItemProps {
  icon: string
  name: string
  hasAI?: boolean
  subsection?: string[][]
  onClick?: () => void
  isMainSidebarItem?: boolean
  active?: boolean
  prefix?: string
}

function SidebarItem({
  icon,
  name,
  hasAI = false,
  subsection,
  isMainSidebarItem = false,
  onClick,
  active = false,
  prefix = ''
}: SidebarItemProps): React.ReactElement {
  // @ts-expect-error - Lazy to fix yay =)
  const { sidebarExpanded, toggleSidebar } = isMainSidebarItem
    ? useGlobalStateContext()
    : { sidebarExpanded: true }
  const [subsectionExpanded, setSubsectionExpanded] = useState(false)
  const { t } = useTranslation()

  function toggleSubsection(): void {
    setSubsectionExpanded(!subsectionExpanded)
  }
  const location = useLocation()

  return (
    <>
      <li
        className={`relative flex items-center gap-6 px-4 font-medium transition-all ${
          location.pathname
            .slice(1)
            .startsWith(
              (prefix !== '' ? `${prefix}/` : '') + titleToPath(name)
            ) || active
            ? "text-bg-800 after:absolute after:right-0 after:top-1/2 after:h-8 after:w-1 after:-translate-y-1/2 after:rounded-full after:bg-custom-500 after:content-[''] dark:text-bg-100"
            : 'text-bg-500 dark:text-bg-500'
        }`}
      >
        <div
          className={`relative flex w-full flex-between gap-6 whitespace-nowrap rounded-lg p-4 transition-all duration-100 ${
            location.pathname
              .slice(1)
              .startsWith(
                (prefix !== '' ? `${prefix}/` : '') + titleToPath(name)
              ) || active
              ? 'bg-bg-200/50 dark:bg-bg-800'
              : 'hover:bg-bg-200/30 dark:hover:bg-bg-800/50'
          }`}
        >
          <div className="flex w-full min-w-0 items-center gap-6">
            <div className="flex size-7 items-center justify-center">
              <Icon
                icon={icon}
                className={`size-6 shrink-0 ${
                  location.pathname
                    .slice(1)
                    .startsWith(
                      (prefix !== '' ? `${prefix}/` : '') + titleToPath(name)
                    ) || active
                    ? 'text-custom-500'
                    : ''
                }`}
              />
            </div>
            <span className="w-full">
              {sidebarExpanded &&
                (isMainSidebarItem ? (
                  <span className="flex w-full flex-between gap-2 truncate">
                    {t(`modules.${toCamelCase(name)}`)}
                    {hasAI && (
                      <Icon
                        icon="mage:stars-c"
                        className="size-4 text-custom-500"
                      />
                    )}
                  </span>
                ) : (
                  t(
                    `sidebar.${
                      location.pathname.split('/').slice(1)[0]
                    }.${toCamelCase(name)}`
                  )
                ))}
            </span>
          </div>

          {onClick !== undefined ? (
            <button
              onClick={() => {
                onClick()
                if (window.innerWidth < 1024) {
                  toggleSidebar()
                }
              }}
              className="absolute left-0 top-0 size-full rounded-lg"
            />
          ) : (
            <Link
              onClick={() => {
                if (window.innerWidth < 1024) {
                  toggleSidebar()
                }
              }}
              to={`./${prefix !== '' ? `${prefix}/` : ''}${titleToPath(name)}`}
              className="absolute left-0 top-0 size-full rounded-lg"
            />
          )}
          {sidebarExpanded && subsection !== undefined && (
            <div className="relative flex flex-between">
              <button
                onClick={toggleSubsection}
                className="rounded-full p-1 hover:bg-bg-200 dark:hover:bg-bg-700/50"
              >
                <Icon
                  icon="tabler:chevron-right"
                  className={`stroke-[2px] text-bg-500 transition-all ${
                    subsectionExpanded ? 'rotate-90' : ''
                  }`}
                />
              </button>
            </div>
          )}
        </div>
      </li>
      {subsection !== undefined && (
        <li
          className={`flex h-auto shrink-0 flex-col gap-2 overflow-hidden px-4 transition-all ${
            subsectionExpanded ||
            location.pathname.slice(1).startsWith(titleToPath(name))
              ? 'max-h-[1000px] py-2'
              : 'max-h-0 py-0'
          }`}
        >
          <ul
            className={`flex w-full flex-col items-center gap-2 rounded-md ${
              !sidebarExpanded ? 'bg-bg-800' : ''
            }`}
          >
            {subsection.map(
              ([subsectionName, subsectionIcon, subsectionLink]) => (
                <Link
                  onClick={() => {
                    if (window.innerWidth < 1024) {
                      toggleSidebar()
                    }
                  }}
                  to={`./${titleToPath(name)}/${subsectionLink}`}
                  key={subsectionName}
                  className={`mx-4 flex w-full items-center ${
                    !sidebarExpanded ? 'justify-center' : ''
                  } gap-4 rounded-lg py-4 ${
                    sidebarExpanded ? 'pl-[3.8rem]' : 'px-2'
                  } font-medium transition-all hover:bg-bg-200/30 dark:hover:bg-bg-800  ${
                    location.pathname.split('/').slice(1)[0] ===
                      titleToPath(name) &&
                    (location.pathname.split('/').slice(1)[1] ===
                      subsectionLink ||
                      (location.pathname.split('/').slice(1)[1] === '' &&
                        name === 'Dashboard'))
                      ? 'bg-bg-200/50 dark:bg-bg-800/50'
                      : 'text-bg-500'
                  }`}
                >
                  <div className="flex size-7 items-center justify-center">
                    <Icon icon={subsectionIcon} className="size-6" />
                  </div>
                  {sidebarExpanded &&
                    t(`modules.subsections.${toCamelCase(subsectionName)}`)}
                </Link>
              )
            )}
          </ul>
        </li>
      )}
    </>
  )
}

export default SidebarItem
