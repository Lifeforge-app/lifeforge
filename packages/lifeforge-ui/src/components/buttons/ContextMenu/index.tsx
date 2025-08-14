import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu'
import clsx from 'clsx'

import Button from '../Button'

interface MenuProps {
  /**
   * The content to be displayed inside the menu.
   * Normally will be one or more `<ContextMenuItem>` component.
   */
  children: React.ReactNode
  /** Optional CSS class names for styling different parts of the menu component. */
  classNames?: {
    wrapper?: string
    button?: string
    icon?: string
    menu?: string
  }
  /**
   * Any valid icon identifier from Iconify.
   * Used to replace the default hamburger menu icon while keeping the default button component.
   */
  customIcon?: string
  /** Callback function triggered when the menu open state changes. */
  onOpenChange?: (open: boolean) => void
  /**
   * Custom React component to use as the menu trigger button instead of the
   * default button with three vertical dots.
   * Can be any valid React node.
   */
  buttonComponent?: React.ReactNode
  /** Horizontal alignment of the menu relative to the trigger button. */
  align?: 'start' | 'center' | 'end'
  /** Side of the trigger button where the menu should appear. */
  side?: 'top' | 'right' | 'bottom' | 'left'
}

function ContextMenu({
  children,
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
        <div className={classNames?.wrapper} role="menu">
          {buttonComponent || (
            <Button
              className={classNames?.button}
              icon={customIcon ?? 'tabler:dots-vertical'}
              iconClassName={classNames?.icon}
              tabIndex={0}
              variant="plain"
              onClick={e => {
                e.preventDefault()
                e.stopPropagation()
              }}
            />
          )}
        </div>
      </DropdownMenuPrimitive.Trigger>
      <DropdownMenuPrimitive.Portal>
        <DropdownMenuPrimitive.Content
          avoidCollisions
          align={align}
          alignOffset={0}
          className={clsx(
            'border-bg-200 bg-bg-50 text-bg-500 dark:border-bg-700 dark:bg-bg-800 z-9999 min-w-56 rounded-xl border text-base shadow-lg',
            'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
            'data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
            classNames?.menu
          )}
          collisionPadding={16}
          side={side}
          sideOffset={12}
        >
          {children}
        </DropdownMenuPrimitive.Content>
      </DropdownMenuPrimitive.Portal>
    </DropdownMenuPrimitive.Root>
  )
}

export default ContextMenu
