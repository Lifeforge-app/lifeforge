import clsx from 'clsx'
import dayjs from 'dayjs'

import {
  ISchemaWithPB,
  TodoListCollectionsSchemas
} from 'shared/types/collections'

function TaskDueDate({
  entry
}: {
  entry: ISchemaWithPB<TodoListCollectionsSchemas.IEntry>
}) {
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
