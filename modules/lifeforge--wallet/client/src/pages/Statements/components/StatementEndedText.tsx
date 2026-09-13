import { Box, Flex, Text, colorWithOpacity } from '@lifeforge/ui'

function StatementEndedText() {
  return (
    <Flex align="center" gap="md" my="xl">
      <Box
        bg={{ base: 'bg-800', print: colorWithOpacity('bg-500', '5%') }}
        height="3px"
        width="100%"
      />
      <Text
        size="xl"
        tracking="widest"
        transform="uppercase"
        weight="semibold"
        whiteSpace="nowrap"
      >
        End of Financial Statements
      </Text>
      <Box
        bg={{ base: 'bg-800', print: colorWithOpacity('bg-500', '5%') }}
        height="3px"
        width="100%"
      />
    </Flex>
  )
}

export default StatementEndedText
