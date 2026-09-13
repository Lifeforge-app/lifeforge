import { Box, Flex, Text } from '@lifeforge/ui'

import {
  type TodoListEntry,
  useTodoListContext
} from '@/providers/TodoListProvider'

function TaskHeader({ entry }: { entry: TodoListEntry }) {
  const { prioritiesQuery } = useTodoListContext()

  const priorities = prioritiesQuery.data ?? []

  return (
    <Flex align="center" gap="sm" minWidth="0" width="100%">
      <Text truncate weight="semibold">
        {entry.summary}
      </Text>
      {entry.priority !== '' && (
        <Box
          flexShrink="0"
          height="0.5rem"
          r="full"
          style={{
            backgroundColor:
              priorities.find(p => p.id === entry.priority)?.color ??
              'lightgray',
            marginBottom: '-0.25rem'
          }}
          width="0.5rem"
        />
      )}
    </Flex>
  )
}

export default TaskHeader
