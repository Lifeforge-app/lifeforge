import moment from 'moment'
import React from 'react'
import { type ITodoListEntry } from '@typedec/TodoList'

function TaskDueDate({ entry }: { entry: ITodoListEntry }): React.ReactElement {
  return (
    <>
      {entry.done && entry.completed_at !== '' ? (
        <div className="text-sm text-bg-500">
          Completed: {moment(entry.completed_at).fromNow()}
        </div>
      ) : (
        entry.due_date !== '' && (
          <div
            className={`text-sm ${
              moment(entry.due_date).isBefore(moment())
                ? 'text-red-500'
                : 'text-bg-500'
            }`}
          >
            Due {moment(entry.due_date).fromNow()}
          </div>
        )
      )}
    </>
  )
}

export default TaskDueDate
