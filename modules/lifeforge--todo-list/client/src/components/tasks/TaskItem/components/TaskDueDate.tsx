import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

import { Text } from '@lifeforge/ui'

import type { TodoListEntry } from '@/providers/TodoListProvider'

dayjs.extend(relativeTime)

function TaskDueDate({ entry }: { entry: TodoListEntry }) {
  return (
    <div>
      {entry.done && entry.completed_at !== '' ? (
        <Text color="muted" size="sm" whiteSpace="nowrap">
          Completed: {dayjs(entry.completed_at).fromNow()}
        </Text>
      ) : (
        entry.due_date !== '' && (
          <Text
            truncate
            color={
              dayjs(entry.due_date).isBefore(dayjs()) ? 'red-500' : 'muted'
            }
            size="sm"
          >
            Due {dayjs(entry.due_date).fromNow()}
          </Text>
        )
      )}
    </div>
  )
}

export default TaskDueDate
