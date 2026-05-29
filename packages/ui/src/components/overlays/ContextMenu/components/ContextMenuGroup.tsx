import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu'

import { Icon } from '@/components/primitives'
import { Box, Flex, Text } from '@/components/primitives'

import * as styles from './ContextMenuGroup.css'

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
export function ContextMenuGroup({
  icon,
  label,
  children,
  className
}: ContextMenuGroupProps) {
  return (
    <DropdownMenuPrimitive.Group className={className}>
      <DropdownMenuPrimitive.Label asChild>
        <Flex align="center" gap="sm" p="md">
          <Icon icon={icon} style={{ width: '1.25rem', height: '1.25rem' }} />
          <Text size="sm" weight="medium">
            {label}
          </Text>
        </Flex>
      </DropdownMenuPrimitive.Label>
      <Box p="md" pt="none">
        <Flex
          shadow
          className={styles.groupContainer}
          direction="column"
          overflow="hidden"
          r="lg"
        >
          {children}
        </Flex>
      </Box>
    </DropdownMenuPrimitive.Group>
  )
}
