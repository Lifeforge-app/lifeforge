import { Box, Flex } from '@/components/primitives'
import { Scrollbar } from '@/components/utilities'

export function ScrollableStory({ children }: { children: React.ReactNode }) {
  return (
    <Box height="100%" minHeight="0" py="3xl" width="100%">
      <Scrollbar minHeight="0" width="100%">
        <Flex direction="column" gap="md">
          {children}
        </Flex>
      </Scrollbar>
    </Box>
  )
}
