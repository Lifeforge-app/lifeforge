import { useQueryClient } from '@tanstack/react-query'
import clsx from 'clsx'

import { Box, Card, Checkbox, Flex, toast } from '@lifeforge/ui'

import { type Task, useTodoListContext } from '@/entities/task'
import { forgeAPI } from '@/manifest'

import { TaskDueDate } from './components/task-due-date'
import { TaskHeader } from './components/task-header'
import { TaskTags } from './components/task-tags'
import * as styles from './task-item.css'

export function TaskItem({
  entry,
  className,
  isInDashboardWidget
}: {
  entry: Task
  className?: string
  isInDashboardWidget?: boolean
}) {
  const queryClient = useQueryClient()

  const { listsQuery, setSelectedTask, setModifyTaskWindowOpenType } =
    useTodoListContext()
  const lists = listsQuery.data ?? []
  const list = lists.find(item => item.id === entry.list)
  const taskTags = entry.tags ?? []
  const hasListIndicator = entry.list !== '' && list !== undefined
  const hasMetadata = entry.due_date !== '' || taskTags.length > 0

  async function toggleTaskCompletion() {
    try {
      await forgeAPI.entries.toggleEntry
        .input({
          id: entry.id
        })
        .mutate(undefined)

      await queryClient.invalidateQueries({ queryKey: forgeAPI.key })
    } catch {
      toast.error('Error toggling task completion')
    }
  }

  function handleTaskClick() {
    if (isInDashboardWidget) return

    setModifyTaskWindowOpenType('update')
    setSelectedTask(entry)
  }

  return (
    <Card
      isInteractive
      align="center"
      as="li"
      className={clsx(styles.item, className)}
      direction="row"
      gap="lg"
      justify="between"
    >
      <Checkbox
        checked={entry.done}
        onCheckedChange={() => void toggleTaskCompletion()}
      />
      <Flex align="center" flex="1" gap="md" minWidth="0">
        {hasListIndicator && (
          <Box
            flexShrink="0"
            height="2.5rem"
            r="full"
            style={{ backgroundColor: list.color, width: '0.25rem' }}
          />
        )}
        <Box minWidth="0" width="100%">
          <TaskHeader entry={entry} />
          {hasMetadata && (
            <Flex align="center" gap="sm" mt="xs">
              <TaskDueDate entry={entry} />
              <TaskTags entry={entry} />
            </Flex>
          )}
        </Box>
      </Flex>
      <Box
        aria-label={`Edit ${entry.summary}`}
        as="button"
        className={styles.overlay}
        onClick={handleTaskClick}
      />
    </Card>
  )
}
