import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu'
import clsx from 'clsx'

function ContextMenuSeparator({ className }: { className?: string }) {
  return (
    <DropdownMenuPrimitive.Separator
      className={clsx('bg-bg-200 dark:bg-bg-700 -mx-1 my-1 h-px', className)}
    />
  )
}

export default ContextMenuSeparator
