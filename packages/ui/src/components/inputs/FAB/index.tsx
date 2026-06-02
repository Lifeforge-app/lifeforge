import { Flex } from '@/components/primitives'

import { Button } from '../Button'

/**
 * Floating Action Button (FAB) component for primary actions, typically positioned at the bottom-right corner of the viewport,
 * and typically used in mobile view.
 */
export function FAB({
  icon = 'tabler:plus',
  visibilityBreakpoint = 'md',
  ...props
}: {
  /** The icon identifier string. Defaults to 'tabler:plus'. */
  icon?: string
  /** The responsive breakpoint at which the FAB should be hidden. Defaults to 'md'. */
  visibilityBreakpoint?: 'sm' | 'md' | 'lg' | 'xl' | false
} & React.ComponentProps<typeof Button>) {
  return (
    <Flex
      asChild
      shadow
      bottom="1.5em"
      display={
        visibilityBreakpoint
          ? { base: 'flex', [visibilityBreakpoint]: 'none' }
          : 'flex'
      }
      position="fixed"
      right="1.5em"
      zIndex="10"
    >
      <Button {...props} icon={icon} />
    </Flex>
  )
}
