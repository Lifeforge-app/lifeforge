import { Box, Flex } from '@components/primitives'

export function ScrollableStory({ children }: { children: React.ReactNode }) {
  return (
    <Box overflow="auto" py="3xl" width="100%">
      <Flex direction="column">{children}</Flex>
    </Box>
  )
}
