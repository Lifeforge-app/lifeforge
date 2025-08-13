import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu'
import clsx from 'clsx'

import Button from '../Button'

interface MenuProps {
  children: React.ReactNode
  classNames?: {
    wrapper?: string
    button?: string
    icon?: string
    menu?: string
  }
  customIcon?: string
  onOpenChange?: (open: boolean) => void
  buttonComponent?: React.ReactNode
  align?: 'start' | 'center' | 'end'
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
            'border-bg-200 bg-bg-100 text-bg-500 dark:border-bg-700 dark:bg-bg-800 z-9999 overflow-auto rounded-md border text-base shadow-lg',
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
