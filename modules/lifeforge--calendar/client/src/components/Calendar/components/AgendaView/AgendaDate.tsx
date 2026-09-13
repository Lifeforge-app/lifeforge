import { Flex, Text } from '@lifeforge/ui'

function AgendaDate({ label }: { label: string }) {
  return (
    <Flex direction="column" p="sm">
      <Text size="lg" weight="semibold">
        {label.split(' ').slice(1).join(' ')}
      </Text>
      <Text color="muted" size="sm" weight="semibold">
        {label.split(' ')[0]}
      </Text>
    </Flex>
  )
}

export default AgendaDate
