import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu'

import { Button } from '@/components/inputs'
import { Bordered, Box } from '@/components/primitives'

interface MenuProps {
  /** The content to be displayed inside the menu. Typically one or more `<ContextMenuItem>` components. */
  children: React.ReactNode
  /** Optional CSS styles for styling different parts of the menu component. */
  styles?: {
    wrapper?: React.CSSProperties
    button?: React.CSSProperties
    icon?: React.CSSProperties
    menu?: React.CSSProperties
  }
  /** Optional CSS class names for styling different parts of the menu component. */
  classNames?: {
    wrapper?: string
    button?: string
    menu?: string
  }
  /** The icon identifier from Iconify to replace the default hamburger menu icon. */
  customIcon?: string
  /** Callback function called when the menu open state changes. */
  onOpenChange?: (open: boolean) => void
  /** Custom React component to use as the menu trigger button instead of the default three-dots button. */
  buttonComponent?: React.ReactNode
  /** The horizontal alignment of the menu relative to the trigger button. */
  align?: 'start' | 'center' | 'end'
  /** The side of the trigger button where the menu should appear. */
  side?: 'top' | 'right' | 'bottom' | 'left'
}

export function ContextMenu({
  children,
  styles,
  classNames,
  customIcon,
  buttonComponent,
  onOpenChange,
  align = 'end',
  side = 'bottom'
}: MenuProps) {
  return (
    <DropdownMenuPrimitive.Root onOpenChange={onOpenChange}>
      <DropdownMenuPrimitive.Trigger asChild>
        <Box
          className={classNames?.wrapper}
          role="menu"
          style={styles?.wrapper}
        >
          {buttonComponent || (
            <Button
              className={classNames?.button}
              icon={customIcon ?? 'tabler:dots-vertical'}
              iconStyle={styles?.icon}
              style={styles?.button}
              tabIndex={0}
              variant="plain"
              onClick={e => {
                e.preventDefault()
                e.stopPropagation()
              }}
            />
          )}
        </Box>
      </DropdownMenuPrimitive.Trigger>
      <DropdownMenuPrimitive.Portal>
        <DropdownMenuPrimitive.Content
          asChild
          avoidCollisions
          align={align}
          alignOffset={0}
          collisionPadding={16}
          side={side}
          sideOffset={12}
        >
          <Bordered
            bg={{ base: 'bg-50', dark: 'bg-800' }}
            borderColor={{ base: 'bg-200', dark: 'bg-700' }}
            className={classNames?.menu}
            minWidth="14rem"
            overflow="hidden"
            r="lg"
            style={{
              width: 'var(--radix-popper-anchor-width)',
              ...styles?.menu
            }}
            zIndex="9999"
          >
            {children}
          </Bordered>
        </DropdownMenuPrimitive.Content>
      </DropdownMenuPrimitive.Portal>
    </DropdownMenuPrimitive.Root>
  )
}
