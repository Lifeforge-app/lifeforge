import { useQueryClient } from '@tanstack/react-query'
import type { ComponentProps } from 'react'

import { Box, Card, Checkbox, Flex, toast } from '@lifeforge/ui'

import { forgeAPI } from '@/manifest'
import {
  type TodoListEntry,
  useTodoListContext
} from '@/providers/TodoListProvider'

import TaskContextMenu from './components/TaskContextMenu'
import TaskDueDate from './components/TaskDueDate'
import TaskHeader from './components/TaskHeader'
import TaskTags from './components/TaskTags'

function TaskItem({
  entry,
  bg,
  isInDashboardWidget
}: {
  entry: TodoListEntry
  bg?: ComponentProps<typeof Card>['bg']
  isInDashboardWidget?: boolean
}) {
  const queryClient = useQueryClient()
  const { statusCounterQuery, listsQuery } = useTodoListContext()

  const lists = listsQuery.data ?? []

  async function toggleTaskCompletion() {
    try {
      await forgeAPI.entries.toggleEntry
        .input({
          id: entry.id
        })
        .mutate(undefined)

      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: forgeAPI.key })
        statusCounterQuery.refetch()
      }, 500)
    } catch {
      toast.error('Error toggling task completion')
    }
  }

  return (
    <Card as="li" bg={bg} direction="row" gap="xl" justify="between">
      <Flex align="center" gap="md" minWidth="0" width="100%">
        {typeof lists !== 'string' && entry.list !== '' && (
          <Box
            flexShrink="0"
            height="2.5rem"
            r="full"
            style={{
              backgroundColor: lists.find(l => l.id === entry.list)?.color
            }}
            width="0.25rem"
          />
        )}
        <Box minWidth="0" width="100%">
          <TaskHeader entry={entry} />
          {(entry.due_date || entry.tags.length > 0) && (
            <Flex align="center" gap="sm" mt="xs">
              <TaskDueDate entry={entry} />
              <TaskTags entry={entry} />
            </Flex>
          )}
        </Box>
      </Flex>
      <Flex align="center" gap="md" justify="center">
        <Checkbox
          checked={entry.done}
          onCheckedChange={() => {
            toggleTaskCompletion()
          }}
        />
        {!isInDashboardWidget && <TaskContextMenu entry={entry} />}
      </Flex>
    </Card>
  )
}

export default TaskItem
