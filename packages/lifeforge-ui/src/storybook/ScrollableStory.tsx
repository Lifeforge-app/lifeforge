import { Box, Flex } from '@components/primitives'
import { Scrollbar } from '@components/utilities'

export function ScrollableStory({ children }: { children: React.ReactNode }) {
  return (
    <Box height="100%" py="3xl" width="100%">
      <Scrollbar width="100%">
        <Flex direction="column">{children}</Flex>
      </Scrollbar>
    </Box>
  )
}
