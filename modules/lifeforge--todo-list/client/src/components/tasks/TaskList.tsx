import { Box, Scrollbar, Stack } from '@lifeforge/ui'

import type { TodoListEntry } from '@/providers/TodoListProvider'

import TaskItem from './TaskItem'

function TaskList({ entries }: { entries: TodoListEntry[] }) {
  return (
    <Box flex="1" minHeight="0" mt="md">
      <Scrollbar>
        <Stack as="ul" flex="1" gap="sm" pb="xl" px="md">
          {entries.map(entry => (
            <TaskItem key={entry.id} entry={entry} />
          ))}
        </Stack>
      </Scrollbar>
    </Box>
  )
}

export default TaskList
