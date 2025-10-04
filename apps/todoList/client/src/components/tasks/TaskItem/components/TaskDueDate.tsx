import type { TodoListEntry } from '@/providers/TodoListProvider'
import clsx from 'clsx'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

function TaskDueDate({ entry }: { entry: TodoListEntry }) {
  return (
    <>
      {entry.done && entry.completed_at !== '' ? (
        <div className="text-bg-500 text-sm whitespace-nowrap">
          Completed: {dayjs(entry.completed_at).fromNow()}
        </div>
      ) : (
        entry.due_date !== '' && (
          <div
            className={clsx(
              'shrink-0 truncate text-sm',
              dayjs(entry.due_date).isBefore(dayjs())
                ? 'text-red-500'
                : 'text-bg-500'
            )}
          >
            Due {dayjs(entry.due_date).fromNow()}
          </div>
        )
      )}
    </>
  )
}

export default TaskDueDate
