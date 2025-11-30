import _ from 'lodash'
import { useCallback, useMemo, useState } from 'react'
import { useNavigate } from 'shared'

import SidebarItemContent from './SidebarItem/components/SidebarItemContent'
import SidebarItemIcon from './SidebarItem/components/SidebarItemIcon'
import SidebarItemSubsection from './SidebarItem/components/SidebarItemSubsection'
import SidebarItemSubsectionExpandIcon from './SidebarItem/components/SidebarItemSubsectionExpandIcon'
import SidebarItemWrapper from './SidebarItem/components/SidebarItemWrapper'

type MainSidebarItemAutoActiveProps =
  | {
      autoActive: true
      active?: never
    }
  | {
      autoActive?: false
      active?: boolean
    }

interface MainSidebarItemBaseProps {
  label: string | React.ReactElement
  /**
   * Icon string or React element to display alongside the label.
   *
   * - Default to icon identifier for Iconify icons (<icon-prefix>:<icon-name>).
   * - Prefix "customHTML:" can be used to render custom SVG/HTML icons.
   * - Prefix "url:" can be used to render image icons from a URL.
   */
  icon?: string | React.ReactElement
  showAIIcon: boolean
  subsection?: {
    label: string
    icon: string | React.ReactElement
    path: string
  }[]
  prefix?: string
  sidebarExpanded: boolean
  toggleSidebar: () => void
}

type MainSidebarItemProps = MainSidebarItemAutoActiveProps &
  MainSidebarItemBaseProps

function MainSidebarItem({
  label,
  icon,
  showAIIcon = false,
  subsection,
  sidebarExpanded,
  toggleSidebar,
  autoActive = false,
  active = false,
  prefix = ''
}: MainSidebarItemProps) {
  const navigate = useNavigate()

  const [subsectionExpanded, setSubsectionExpanded] = useState(false)

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
    setSubsectionExpanded(!subsectionExpanded)

    if (subsection?.length) {
      return
    }

    navigate(
      `/${prefix !== '' ? prefix + '/' : ''}${_.kebabCase(label.toString())}`
    )

    if (window.innerWidth < 1024) {
      toggleSidebar?.()
    }
  }, [subsectionExpanded, subsection, prefix, label, navigate, toggleSidebar])

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
        <SidebarItemIcon
          active={autoActive ? isLocationMatched : active}
          icon={icon}
        />
        <SidebarItemContent
          active={autoActive ? isLocationMatched : active}
          hasAI={showAIIcon}
          hasSubsection={subsection !== undefined}
          isMainSidebarItem={true}
          label={label}
          sidebarExpanded={sidebarExpanded}
        />
        {sidebarExpanded && subsection !== undefined && (
          <SidebarItemSubsectionExpandIcon
            subsectionExpanded={subsectionExpanded}
            toggleSubsection={handleToggleSubsection}
          />
        )}
      </SidebarItemWrapper>
      {subsection !== undefined && (
        <SidebarItemSubsection
          label={label}
          subsection={subsection.map(e => ({
            ...e,
            callback: e.path
          }))}
          subsectionExpanded={subsectionExpanded}
        />
      )}
    </>
  )
}

export default MainSidebarItem
