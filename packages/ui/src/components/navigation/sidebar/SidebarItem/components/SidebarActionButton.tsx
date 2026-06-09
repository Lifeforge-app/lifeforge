import { Box, Icon, Text, Transition } from '@/components/primitives'
import { useModuleSidebarState } from '@/providers'
import { colorWithOpacity } from '@/system'

export function SidebarActionButton({
  icon,
  onClick
}: {
  icon: string
  onClick: () => void
}) {
  const { setIsSidebarOpen } = useModuleSidebarState()

  return (
    <Transition duration={100}>
      <Text
        asChild
        color={{
          base: 'muted',
          hover: 'bg-800',
          darkHover: 'bg-100'
        }}
      >
        <Box
          as="button"
          bg={{
            hover: colorWithOpacity('bg-200', '70%'),
            darkHover: colorWithOpacity('bg-700', '70%')
          }}
          p="sm"
          r="md"
          zIndex="9999"
          onClick={e => {
            e.stopPropagation()
            onClick()
            setIsSidebarOpen(false)
          }}
        >
          <Icon icon={icon} />
        </Box>
      </Text>
    </Transition>
  )
}
