import { Scrollbar } from '@/components/layout'
import { Box, Flex } from '@/components/primitives'

export function ScrollableStory({ children }: { children: React.ReactNode }) {
  return (
    <Box asChild height="100%" minHeight="24rem" width="100%">
      <Scrollbar>
        <Flex direction="column" gap="md" py="3xl">
          {children}
        </Flex>
      </Scrollbar>
    </Box>
  )
}
