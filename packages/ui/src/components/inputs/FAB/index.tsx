import { ContextMenu } from '@/components/overlays/ContextMenu'

import { Button } from '../Button'

/**
 * Floating Action Button (FAB) component for primary actions, typically positioned at the bottom-right corner of the viewport,
 * and typically used in mobile view. When children are provided, the FAB renders a context menu instead of firing directly.
 */
export function FAB({
  icon = 'tabler:plus',
  visibilityBreakpoint = 'md',
  children,
  menuProps,
  ...props
}: {
  /** The icon identifier string. Defaults to 'tabler:plus'. */
  icon?: string
  /** The responsive breakpoint at which the FAB should be hidden. Defaults to 'md'. */
  visibilityBreakpoint?: 'sm' | 'md' | 'lg' | 'xl' | false
  /** Menu items. When provided, the FAB opens a context menu instead of firing directly. */
  children?: React.ReactNode
  /** Props forwarded to the underlying context menu when menu items are provided. */
  menuProps?: Omit<
    React.ComponentProps<typeof ContextMenu>,
    'buttonComponent' | 'children'
  >
} & Omit<React.ComponentProps<typeof Button>, 'children'>) {
  const button = (
    <Button
      shadow
      bottom="1.5em"
      display={
        visibilityBreakpoint
          ? { base: 'flex', [visibilityBreakpoint]: 'none' }
          : 'flex'
      }
      position={children ? 'static' : 'fixed'}
      right="1.5em"
      zIndex="10"
      {...props}
      icon={icon}
    />
  )

  if (!children) {
    return button
  }

  return (
    <ContextMenu
      bottom="1.5em"
      display={
        visibilityBreakpoint
          ? { base: 'block', [visibilityBreakpoint]: 'none' }
          : undefined
      }
      position="fixed"
      right="1.5em"
      side="top"
      width="min-content"
      zIndex="10"
      {...menuProps}
      buttonComponent={button}
    >
      {children}
    </ContextMenu>
  )
}
