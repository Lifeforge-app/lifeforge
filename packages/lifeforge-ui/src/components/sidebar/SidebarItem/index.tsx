import _ from 'lodash'
import { useCallback, useMemo, useState } from 'react'
import { useNavigate } from 'react-router'

import SidebarCancelButton from './components/SidebarCancelButton'
import SidebarCollapseButton from './components/SidebarCollapseButton'
import SidebarItemContent from './components/SidebarItemContent'
import SidebarItemIcon from './components/SidebarItemIcon'
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
  subsection?: {
    label: string
    icon: string | React.ReactElement
    path: string
  }[]
  prefix?: string
  sidebarExpanded: boolean
  toggleSidebar: () => void

  sideStripColor?: never
  onClick?: never

  number?: never
  onCancelButtonClick?: never
  hamburgerMenuItems?: never

  isCollapsed?: never
  onCollapseButtonClick?: never
  showCollapseSpacer?: never
  namespace?: never
  needTranslate?: never
}

interface SubSidebarItemProps {
  isMainSidebarItem?: false

  showAIIcon?: never
  subsection?: never
  prefix?: never
  sidebarExpanded?: never
  toggleSidebar?: never

  onClick: () => void
  sideStripColor?: string

  number?: number
  onCancelButtonClick?: () => void
  hamburgerMenuItems?: React.ReactElement

  isCollapsed?: boolean
  onCollapseButtonClick?: () => void
  showCollapseSpacer?: boolean
  namespace?: string
  needTranslate?: boolean
}

interface SidebarItemBaseProps {
  label: string
  icon?: string | React.ReactElement
}

type SidebarItemProps = SidebarItemAutoActiveProps &
  (MainSidebarItemProps | SubSidebarItemProps) &
  SidebarItemBaseProps

function SidebarItem({
  label,
  icon,
  sideStripColor,
  showAIIcon = false,
  subsection,
  isMainSidebarItem = false,
  sidebarExpanded,
  toggleSidebar,
  onClick,
  autoActive = false,
  active = false,
  prefix = '',
  number,
  onCancelButtonClick,
  hamburgerMenuItems,

  isCollapsed,
  onCollapseButtonClick,
  showCollapseSpacer,
  namespace,
  needTranslate = true
}: SidebarItemProps) {
  const navigate = useNavigate()

  const [subsectionExpanded, setSubsectionExpanded] = useState(
    isMainSidebarItem
      ? false
      : subsection !== undefined &&
          location.pathname.slice(1).startsWith(_.kebabCase(label))
  )

  const isLocationMatched = useMemo(
    () =>
      location.pathname
        .slice(1)
        .startsWith((prefix !== '' ? `${prefix}/` : '') + _.kebabCase(label)),
    [location.pathname, prefix, label]
  )

  const handleNavigation = useCallback(() => {
    if (onClick !== undefined) {
      onClick()

      return
    }

    if (isMainSidebarItem) {
      setSubsectionExpanded(!subsectionExpanded)

      if (subsection?.length) {
        return
      }

      navigate(`./${prefix !== '' ? prefix + '/' : ''}${_.kebabCase(label)}`)
    }

    if (window.innerWidth < 1024) {
      toggleSidebar?.()
    }
  }, [isMainSidebarItem, subsectionExpanded, subsection, prefix, label])

  const handleToggleSubsection = useCallback(() => {
    if (subsection !== undefined) {
      setSubsectionExpanded(!subsectionExpanded)
    }
  }, [subsection, subsectionExpanded])

  return (
    <>
      <SidebarItemWrapper
        active={autoActive ? isLocationMatched : active}
        onClick={handleNavigation}
      >
        {onCollapseButtonClick && (
          <>
            <SidebarCollapseButton
              isCollapsed={isCollapsed === true}
              onClick={onCollapseButtonClick}
            />
          </>
        )}
        {showCollapseSpacer && !onCollapseButtonClick && (
          <div className="w-8 shrink-0"></div>
        )}

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
          active={autoActive ? isLocationMatched : active}
          hamburgerMenuItems={hamburgerMenuItems}
          hasAI={showAIIcon}
          isMainSidebarItem={isMainSidebarItem}
          label={label}
          namespace={namespace}
          needTranslate={needTranslate}
          number={number}
          sidebarExpanded={!!sidebarExpanded}
          onCancelButtonClick={onCancelButtonClick}
        />
        {sidebarExpanded && subsection !== undefined && (
          <SidebarItemSubsectionExpandIcon
            subsectionExpanded={subsectionExpanded}
            toggleSubsection={handleToggleSubsection}
          />
        )}
        {active && onCancelButtonClick !== undefined && (
          <SidebarCancelButton onClick={onCancelButtonClick} />
        )}
      </SidebarItemWrapper>
      {subsection !== undefined && (
        <SidebarItemSubsection
          label={label}
          subsection={subsection}
          subsectionExpanded={subsectionExpanded}
        />
      )}
    </>
  )
}

export default SidebarItem
