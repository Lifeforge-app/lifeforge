import { useCallback } from 'react'

import { useModuleSidebarState } from '@components/layout'

import SidebarCancelButton from './components/SidebarCancelButton'
import SidebarItemContent from './components/SidebarItemContent'
import SidebarItemIcon from './components/SidebarItemIcon'
import SidebarItemWrapper from './components/SidebarItemWrapper'

interface SidebarItemProps {
  /** Label string or React element to display for the sidebar item. */
  label: string | React.ReactElement
  /**
   * Icon string or React element to display alongside the label.
   *
   * - Default to icon identifier for Iconify icons (<icon-prefix>:<icon-name>).
   * - Prefix "customHTML:" can be used to render custom SVG/HTML icons.
   * - Prefix "url:" can be used to render image icons from a URL.
   */
  icon?: string | React.ReactElement
  /** Whether the sidebar is currently selected/active. */
  active?: boolean
  /** Callback function triggered when the sidebar item is clicked. */
  onClick?: () => void
  /** Callback function triggered when the cancel button is clicked.
   * If provided, a cancel button is shown when the sidebar item is active.
   */
  onCancelButtonClick?: () => void
  /** Color for the side strip indicator. If not provided, no side strip is shown. */
  sideStripColor?: string
  /** Optional number badge to display on the right side of the sidebar item. */
  number?: number
  /** Props for the action button displayed on the sidebar item. */
  actionButtonProps?: {
    icon: string
    onClick: () => void
  }
  /** React element containing context menu items.
   * If provided, a hamburger menu is shown when user hovers over the sidebar item.
   */
  contextMenuItems?: React.ReactElement
  /** Styling for the sidebar item. */
  classNames?: {
    wrapper?: string
    icon?: string
  }
  /** The i18n namespace for internationalization. See the [main documentation](https://docs.lifeforge.melvinchia.dev) for more details. */
  namespace?: string | false
}

/**
 * A clickable navigation item for use in sidebar menus.
 *
 * Displays a label with an optional icon, supports active states, and can include
 * visual indicators like colored side strips and number badges. Provides advanced
 * features such as context menus, action buttons, and cancel buttons for enhanced
 * user interaction.
 * ```
 */
function SidebarItem({
  label,
  icon,
  active = false,
  onClick,
  onCancelButtonClick,
  sideStripColor,
  number,
  actionButtonProps,
  contextMenuItems,
  classNames,
  namespace
}: SidebarItemProps) {
  const { setIsSidebarOpen } = useModuleSidebarState()

  const handleNavigation = useCallback(() => {
    if (onClick !== undefined) {
      setIsSidebarOpen(false)
      onClick()
    }
  }, [onClick, setIsSidebarOpen])

  return (
    <SidebarItemWrapper
      active={active}
      className={classNames?.wrapper}
      onClick={handleNavigation}
    >
      {sideStripColor !== undefined && (
        <span
          className="block h-8 w-1 shrink-0 rounded-full"
          style={{
            backgroundColor: sideStripColor
          }}
        />
      )}
      <SidebarItemIcon
        active={active}
        className={classNames?.icon}
        icon={icon}
      />
      <SidebarItemContent
        actionButtonProps={actionButtonProps}
        active={active}
        contextMenuItems={contextMenuItems}
        hasAI={false}
        isMainSidebarItem={false}
        label={label}
        namespace={namespace}
        number={number}
        sidebarExpanded={false}
        onCancelButtonClick={onCancelButtonClick}
      />
      {active && onCancelButtonClick !== undefined && (
        <SidebarCancelButton onClick={onCancelButtonClick} />
      )}
    </SidebarItemWrapper>
  )
}

export default SidebarItem
