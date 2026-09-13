import { Box, Flex, Text } from '@lifeforge/ui'

import { type Task, useTodoListContext } from '@/entities/task'

import * as styles from '../task-item.css'

export function TaskHeader({ entry }: { entry: Task }) {
  const { prioritiesQuery } = useTodoListContext()

  const priorities = prioritiesQuery.data ?? []
  const priority = priorities.find(item => item.id === entry.priority)
  const hasPriority = entry.priority !== ''
  const priorityColor = priority?.color ?? 'lightgray'

  return (
    <Flex align="center" gap="sm" minWidth="0" width="100%">
      <Text className={styles.summary} weight="semibold">
        {entry.summary}
      </Text>
      {hasPriority && (
        <Box
          aria-hidden="true"
          flexShrink="0"
          height="0.5rem"
          r="full"
          style={{ backgroundColor: priorityColor, marginBottom: '-0.25rem' }}
          width="0.5rem"
        />
      )}
    </Flex>
  )
}
