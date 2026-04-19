import { Box, Flex } from '@components/primitives'

export function ScrollableStory({ children }: { children: React.ReactNode }) {
  return (
    <Box overflow="auto" p="3xl" width="100%">
      <Flex direction="column" gap="xl">
        {children}
      </Flex>
    </Box>
  )
}
