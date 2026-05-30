import { Box, Icon, Text, Transition } from '@/components/primitives'

export function SidebarItemSubsectionExpandIcon({
  toggleSubsection,
  subsectionExpanded
}: {
  toggleSubsection: () => void
  subsectionExpanded: boolean
}) {
  return (
    <Box
      asChild
      bg={{
        hover: 'bg-200',
        darkHover: 'bg-700'
      }}
      p="sm"
      r="md"
      style={{
        transition: 'all 0.2s'
      }}
    >
      <Text
        as="button"
        color={{ base: 'bg-500', hover: 'bg-800', darkHover: 'bg-50' }}
        onClick={e => {
          e.stopPropagation()
          toggleSubsection()
        }}
      >
        <Transition property="transform">
          <Icon
            icon="tabler:chevron-right"
            style={{
              height: '1.25rem',
              strokeWidth: 2,
              transform: subsectionExpanded ? 'rotate(90deg)' : undefined,
              width: '1.25rem'
            }}
          />
        </Transition>
      </Text>
    </Box>
  )
}
