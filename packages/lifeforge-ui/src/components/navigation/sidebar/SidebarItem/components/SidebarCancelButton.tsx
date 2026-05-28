import { Icon } from '@iconify/react'
import { useModuleSidebarState } from 'shared'

import { Box, Text } from '@components/primitives'

export function SidebarCancelButton({ onClick }: { onClick: () => void }) {
  const { setIsSidebarOpen } = useModuleSidebarState()

  return (
    <Box
      asChild
      bg={{
        hover: 'bg-200',
        darkHover: 'bg-700'
      }}
      p="sm"
      rounded="md"
      style={{
        transition: 'all 0.2s'
      }}
    >
      <Text
        as="button"
        color={{ base: 'bg-500', hover: 'bg-800', darkHover: 'bg-50' }}
        onClick={e => {
          e.stopPropagation()
          onClick()
          setIsSidebarOpen(false)
        }}
      >
        <Icon icon="tabler:x" style={{ height: '1.25rem', width: '1.25rem' }} />
      </Text>
    </Box>
  )
}

