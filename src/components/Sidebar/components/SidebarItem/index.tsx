import { Icon } from '@iconify/react'
import React, { useMemo, useState } from 'react'
import { useLocation } from 'react-router'
import HamburgerMenu from '@components/ButtonsAndInputs/HamburgerMenu'
import { useGlobalStateContext } from '@providers/GlobalStateProvider'
import { titleToPath } from '@utils/strings'
import SidebarItemContent from './components/SidebarItemContent'
import SidebarItemIcon from './components/SidebarItemIcon'
import SidebarItemOnClickElement from './components/SidebarItemOnClickElement'
import SidebarItemSubsection from './components/SidebarItemSubsection'
import SidebarItemSubsectionExpandIcon from './components/SidebarItemSubsectionExpandIcon'
import SidebarItemWrapper from './components/SidebarItemWrapper'

interface SidebarItemProps {
  name: string
  icon?: string
  smallIcon?: React.ReactElement
  color?: string
  hasAI?: boolean
  subsection?: string[][]
  onClick?: () => void
  isMainSidebarItem?: boolean
  autoActive?: boolean
  active?: boolean
  prefix?: string
  number?: number
  needTranslate?: boolean
  onCancelButtonClick?: () => void
  hamburgerMenuItems?: React.ReactElement
}

function SidebarItem({
  name,
  icon,
  smallIcon,
  color,
  hasAI = false,
  subsection,
  isMainSidebarItem = false,
  onClick,
  autoActive = false,
  active = false,
  prefix = '',
  number,
  needTranslate = true,
  onCancelButtonClick,
  hamburgerMenuItems
}: SidebarItemProps): React.ReactElement {
  const location = useLocation()
  const { sidebarExpanded, toggleSidebar } = isMainSidebarItem
    ? useGlobalStateContext()
    : { sidebarExpanded: true, toggleSidebar: () => {} }
  const [subsectionExpanded, setSubsectionExpanded] = useState(
    subsection !== undefined &&
      location.pathname.slice(1).startsWith(titleToPath(name))
  )
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const isLocationMatched = useMemo(
    () =>
      location.pathname
        .slice(1)
        .startsWith((prefix !== '' ? `${prefix}/` : '') + titleToPath(name)),
    [location.pathname, prefix, name]
  )

  function toggleSubsection(): void {
    setSubsectionExpanded(!subsectionExpanded)
  }

  return (
    <>
      <SidebarItemWrapper active={autoActive ? isLocationMatched : active}>
        {color !== undefined && (
          <span
            className="block h-8 w-1 shrink-0 rounded-full"
            style={{
              backgroundColor: color
            }}
          />
        )}
        <div className="flex w-full min-w-0 items-center gap-6">
          <SidebarItemIcon
            active={autoActive ? isLocationMatched : active}
            icon={icon}
            smallIcon={smallIcon}
          />
          <SidebarItemContent
            name={name}
            sidebarExpanded={sidebarExpanded}
            isMainSidebarItem={isMainSidebarItem}
            hasAI={hasAI}
            number={number}
            isMenuOpen={isMenuOpen}
            hamburgerMenuItems={hamburgerMenuItems}
            active={autoActive ? isLocationMatched : active}
            onCancelButtonClick={onCancelButtonClick}
            needTranslate={needTranslate}
          />
        </div>
        <SidebarItemOnClickElement
          onClick={onClick}
          setSubsectionExpanded={setSubsectionExpanded}
          isMainSidebarItem={isMainSidebarItem}
          prefix={prefix}
          name={name}
        />
        {sidebarExpanded && subsection !== undefined && (
          <SidebarItemSubsectionExpandIcon
            subsectionExpanded={subsectionExpanded}
            toggleSubsection={toggleSubsection}
          />
        )}
        {active && onCancelButtonClick !== undefined && (
          <button
            onClick={e => {
              e.stopPropagation()
              onCancelButtonClick()
            }}
            className="z-[9999] hidden overscroll-contain rounded-md p-2 text-bg-500 hover:bg-bg-200/50 hover:text-bg-800 group-hover:block dark:hover:bg-bg-700/50 dark:hover:text-bg-50"
          >
            <Icon icon="tabler:x" className="size-5" />
          </button>
        )}
        {!active && hamburgerMenuItems !== undefined && (
          <HamburgerMenu
            smallerPadding
            onButtonClick={e => {
              e.stopPropagation()
              setIsMenuOpen(true)
            }}
            className={`relative overscroll-contain ${
              !isMenuOpen ? 'hidden group-hover:block' : ''
            }`}
            onClose={() => {
              setIsMenuOpen(false)
            }}
          >
            {hamburgerMenuItems}
          </HamburgerMenu>
        )}
      </SidebarItemWrapper>
      {subsection !== undefined && (
        <SidebarItemSubsection
          subsection={subsection}
          name={name}
          sidebarExpanded={sidebarExpanded}
          toggleSidebar={toggleSidebar}
          subsectionExpanded={subsectionExpanded}
        />
      )}
    </>
  )
}

export default SidebarItem
