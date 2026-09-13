import { Flex, Text } from '@lifeforge/ui'

function WeekHeader({ label }: { label: string }) {
  return (
    <Flex align="center" direction="column" justify="center">
      <Text color="muted" size="sm" weight="semibold">
        {label.split(' ').pop()}
      </Text>
      <Text size="xl" weight="semibold">
        {label.split(' ')[0]}
      </Text>
    </Flex>
  )
}

export default WeekHeader
