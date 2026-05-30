import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu'

import { Box, Flex, Icon, Text } from '@/components/primitives'
import { colorWithOpacity } from '@/system'

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
          <Icon icon={icon} />
          <Text size="sm" weight="medium">
            {label}
          </Text>
        </Flex>
      </DropdownMenuPrimitive.Label>
      <Box p="md" pt="none">
        <Flex
          shadow
          bg={{
            base: colorWithOpacity('bg-200', '30%'),
            dark: colorWithOpacity('bg-700', '50%')
          }}
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
