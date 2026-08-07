import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu'
import type React from 'react'

import { Button } from '@/components/inputs'
import {
  Bordered,
  type BorderedProps,
  Box,
  type BoxProps,
  type IconProps
} from '@/components/primitives'

interface MenuProps extends BoxProps {
  /** The content to be displayed inside the menu. Typically one or more `<ContextMenuItem>` components. */
  children: React.ReactNode
  /** Optional props for styling different parts of the menu component. */
  componentProps?: {
    button?: React.ComponentProps<typeof Button>
    icon?: IconProps
    menu?: BorderedProps
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
  componentProps,
  customIcon,
  buttonComponent,
  onOpenChange,
  align = 'end',
  side = 'bottom',
  ...rest
}: MenuProps) {
  return (
    <DropdownMenuPrimitive.Root onOpenChange={onOpenChange}>
      <DropdownMenuPrimitive.Trigger asChild>
        <Box {...rest} role="menu">
          {buttonComponent || (
            <Button
              icon={customIcon ?? 'tabler:dots-vertical'}
              iconProps={componentProps?.icon}
              tabIndex={0}
              variant="plain"
              {...componentProps?.button}
              onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                e.preventDefault()
                e.stopPropagation()
                componentProps?.button?.onClick?.(e)
              }}
            />
          )}
        </Box>
      </DropdownMenuPrimitive.Trigger>
      <DropdownMenuPrimitive.Portal container={document.getElementById('app')!}>
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
            minWidth="14rem"
            overflow="hidden"
            r="lg"
            zIndex="9999"
            {...componentProps?.menu}
            style={{
              width: 'var(--radix-popper-anchor-width)',
              ...componentProps?.menu?.style
            }}
          >
            {children}
          </Bordered>
        </DropdownMenuPrimitive.Content>
      </DropdownMenuPrimitive.Portal>
    </DropdownMenuPrimitive.Root>
  )
}
