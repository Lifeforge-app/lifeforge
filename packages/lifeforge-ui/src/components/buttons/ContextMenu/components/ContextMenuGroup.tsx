import { Icon } from '@iconify/react'
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu'

interface ContextMenuGroupProps {
  /** The icon to display before the group label. Should be a valid icon name from Iconify. */
  icon: string
  /** The text label for the group header. */
  label: string
  /** The menu items or content to render within this group. Typically one or more `<ContextMenuItem>` components. */
  children: React.ReactNode
  /** Additional CSS class names to apply to the root group element. */
  className?: string
}

/**
 * A grouped section within a context menu containing a labeled header.
 */
function ContextMenuGroup({
  icon,
  label,
  children,
  className
}: ContextMenuGroupProps) {
  return (
    <DropdownMenuPrimitive.Group className={className}>
      <DropdownMenuPrimitive.Label className="text-bg-500 flex items-center gap-3 p-4">
        <Icon className="size-5" icon={icon} />
        {label}
      </DropdownMenuPrimitive.Label>
      <div className="p-4 pt-0">
        <div className="divide-bg-200/80 bg-bg-200/30 shadow-custom dark:divide-bg-700 dark:bg-bg-700/50 flex flex-col divide-y overflow-hidden rounded-lg">
          {children}
        </div>
      </div>
    </DropdownMenuPrimitive.Group>
  )
}

export default ContextMenuGroup
