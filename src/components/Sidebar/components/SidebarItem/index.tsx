/* eslint-disable @typescript-eslint/member-delimiter-style */
import React, { useMemo, useState } from 'react'
import { useLocation } from 'react-router'
import { useGlobalStateContext } from '@providers/GlobalStateProvider'
import { titleToPath } from '@utils/strings'
import SidebarCancelButton from './components/SidebarCancelButton'
import SidebarItemContent from './components/SidebarItemContent'
import SidebarItemIcon from './components/SidebarItemIcon'
import SidebarItemOnClickElement from './components/SidebarItemOnClickElement'
import SidebarItemSubsection from './components/SidebarItemSubsection'
import SidebarItemSubsectionExpandIcon from './components/SidebarItemSubsectionExpandIcon'
import SidebarItemWrapper from './components/SidebarItemWrapper'

type SidebarItemAutoActiveProps =
  | {
      autoActive: true
      active?: never
    }
  | {
      autoActive?: false
      active: boolean
    }

interface MainSidebarItemProps {
  isMainSidebarItem: true

  showAIIcon: boolean
  subsection?: string[][]
  prefix?: string

  sideStripColor?: never
  needTranslate?: never
  onClick?: never

  number?: never
  onCancelButtonClick?: never
  hamburgerMenuItems?: never
}

interface SubSidebarItemProps {
  isMainSidebarItem?: false

  showAIIcon?: never
  subsection?: never
  prefix?: never

  onClick: () => void
  sideStripColor?: string
  needTranslate?: boolean

  number?: number
  onCancelButtonClick?: () => void
  hamburgerMenuItems?: React.ReactElement
}

interface SidebarItemBaseProps {
  name: string
  icon?: string | React.ReactElement
}

type SidebarItemProps = SidebarItemAutoActiveProps &
  (MainSidebarItemProps | SubSidebarItemProps) &
  SidebarItemBaseProps

function SidebarItem({
  name,
  icon,
  sideStripColor,
  showAIIcon = false,
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

  const [subsectionExpanded, setSubsectionExpanded] = isMainSidebarItem
    ? useState(
        subsection !== undefined &&
          location.pathname.slice(1).startsWith(titleToPath(name))
      )
    : [false, () => {}]
  const isLocationMatched = useMemo(
    () =>
      location.pathname
        .slice(1)
        .startsWith((prefix !== '' ? `${prefix}/` : '') + titleToPath(name)),
    [location.pathname, prefix, name]
  )

  return (
    <>
      <SidebarItemWrapper active={autoActive ? isLocationMatched : active}>
        {sideStripColor !== undefined && (
          <span
            className="block h-8 w-1 shrink-0 rounded-full"
            style={{
              backgroundColor: sideStripColor
            }}
          />
        )}
        <SidebarItemIcon
          active={autoActive ? isLocationMatched : active}
          icon={icon}
        />
        <SidebarItemContent
          name={name}
          sidebarExpanded={sidebarExpanded}
          isMainSidebarItem={isMainSidebarItem}
          hasAI={showAIIcon}
          number={number}
          hamburgerMenuItems={hamburgerMenuItems}
          active={autoActive ? isLocationMatched : active}
          onCancelButtonClick={onCancelButtonClick}
          needTranslate={needTranslate}
        />
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
            toggleSubsection={() => {
              setSubsectionExpanded(!subsectionExpanded)
            }}
          />
        )}
        {active && onCancelButtonClick !== undefined && (
          <SidebarCancelButton onClick={onCancelButtonClick} />
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
