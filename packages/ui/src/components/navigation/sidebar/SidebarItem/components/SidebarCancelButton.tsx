import { useModuleSidebarState } from '../../../../../providers'

import { Box, Icon, Text, Transition } from '@/components/primitives'

export function SidebarCancelButton({ onClick }: { onClick: () => void }) {
  const { setIsSidebarOpen } = useModuleSidebarState()

  return (
    <Transition>
      <Box
        asChild
        bg={{
          hover: 'bg-200',
          darkHover: 'bg-700'
        }}
        p="sm"
        r="md"
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
          <Icon icon="tabler:x" />
        </Text>
      </Box>
    </Transition>
  )
}
