import clsx from 'clsx'
import dayjs from 'dayjs'

import { type ITodoListEntry } from '../../../../interfaces/todo_list_interfaces'

function TaskDueDate({ entry }: { entry: ITodoListEntry }) {
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
              'text-sm whitespace-nowrap',
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
