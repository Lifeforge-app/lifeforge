import { Box } from '@components/primitives'

/**
 * A divider component used to separate sections within the sidebar.
 */
export function SidebarDivider({ noMargin = false }: { noMargin?: boolean }) {
  return (
    <Box
      bg={{
        base: 'bg-200',
        dark: 'bg-800'
      }}
      flexShrink="0"
      height="1px"
      my={!noMargin ? 'md' : 'none'}
    />
  )
}

