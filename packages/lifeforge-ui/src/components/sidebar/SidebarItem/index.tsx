import { useModuleSidebarState } from '@components/layouts'
import _ from 'lodash'
import { useCallback, useMemo, useState } from 'react'
import { useNavigate } from 'shared'

import SidebarActionButton from './components/SidebarActionButton'
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

  activeClassNames?: never
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
  contextMenuItems?: never
  actionButtonIcon?: never
  onActionButtonClick?: never

  isCollapsed?: never
  onCollapseButtonClick?: never
  showCollapseSpacer?: never
  namespace?: never
  needTranslate?: never
}

interface SubSidebarItemProps {
  isMainSidebarItem?: false

  activeClassNames?: {
    wrapper?: string
    icon?: string
  }
  showAIIcon?: never
  subsection?: never
  prefix?: never
  sidebarExpanded?: never
  toggleSidebar?: never

  onClick: () => void
  sideStripColor?: string

  number?: number
  onCancelButtonClick?: () => void
  contextMenuItems?: React.ReactElement
  actionButtonIcon?: string
  onActionButtonClick?: () => void

  isCollapsed?: boolean
  onCollapseButtonClick?: () => void
  showCollapseSpacer?: boolean
  namespace?: string
  needTranslate?: boolean
}

interface SidebarItemBaseProps {
  label: string | React.ReactElement
  /**
   * Icon string or React element to display alongside the label.
   *
   * - Default to icon identifier for Iconify icons (<icon-prefix>:<icon-name>).
   * - Prefix "customHTML:" can be used to render custom SVG/HTML icons.
   * - Prefix "url:" can be used to render image icons from a URL.
   */
  icon?: string | React.ReactElement
}

type SidebarItemProps = SidebarItemAutoActiveProps &
  (MainSidebarItemProps | SubSidebarItemProps) &
  SidebarItemBaseProps

function SidebarItem({
  label,
  icon,
  activeClassNames,
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
  actionButtonIcon,
  onActionButtonClick,
  contextMenuItems,

  isCollapsed,
  onCollapseButtonClick,
  showCollapseSpacer,
  namespace,
  needTranslate = true
}: SidebarItemProps) {
  const navigate = useNavigate()

  const { setIsSidebarOpen } = useModuleSidebarState()

  const [subsectionExpanded, setSubsectionExpanded] = useState(
    isMainSidebarItem
      ? false
      : subsection !== undefined &&
          location.pathname.slice(1).startsWith(_.kebabCase(label.toString()))
  )

  const isLocationMatched = useMemo(
    () =>
      location.pathname
        .slice(1)
        .startsWith(
          (prefix !== '' ? `${prefix}/` : '') + _.kebabCase(label.toString())
        ),
    [location.pathname, prefix, label]
  )

  const handleNavigation = useCallback(() => {
    if (onClick !== undefined) {
      setIsSidebarOpen(false)
      onClick()

      return
    }

    if (isMainSidebarItem) {
      setSubsectionExpanded(!subsectionExpanded)

      if (subsection?.length) {
        return
      }

      navigate(
        `/${prefix !== '' ? prefix + '/' : ''}${_.kebabCase(label.toString())}`
      )
    }

    if (window.innerWidth < 1024) {
      toggleSidebar?.()
    }
  }, [
    isMainSidebarItem,
    subsectionExpanded,
    subsection,
    prefix,
    label,
    navigate,
    toggleSidebar
  ])

  const handleToggleSubsection = useCallback(() => {
    if (subsection !== undefined) {
      setSubsectionExpanded(!subsectionExpanded)
    }
  }, [subsection, subsectionExpanded])

  return (
    <>
      <SidebarItemWrapper
        active={autoActive ? isLocationMatched : active}
        activeClassName={activeClassNames?.wrapper}
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
          activeClassName={activeClassNames?.icon}
          icon={icon}
        />
        <SidebarItemContent
          active={autoActive ? isLocationMatched : active}
          contextMenuItems={contextMenuItems}
          hasAI={showAIIcon}
          isMainSidebarItem={isMainSidebarItem}
          label={label}
          namespace={namespace}
          needTranslate={needTranslate}
          number={number}
          sidebarExpanded={!!sidebarExpanded}
          onCancelButtonClick={onCancelButtonClick}
        />
        {actionButtonIcon && onActionButtonClick && (
          <SidebarActionButton
            icon={actionButtonIcon}
            onClick={onActionButtonClick}
          />
        )}
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
