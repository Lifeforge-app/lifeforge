import { Box, Flex } from '@/components/primitives'
import { Scrollbar } from '@/components/utilities'

export function ScrollableStory({ children }: { children: React.ReactNode }) {
  return (
    <Box asChild height="100%" minHeight="0" py="3xl" width="100%">
      <Scrollbar>
        <Flex direction="column" gap="md">
          {children}
        </Flex>
      </Scrollbar>
    </Box>
  )
}
