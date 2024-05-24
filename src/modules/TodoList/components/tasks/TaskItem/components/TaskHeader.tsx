import React from 'react'
import { type ITodoListEntry } from '@typedec/TodoList'

function TaskHeader({ entry }: { entry: ITodoListEntry }): React.ReactElement {
  return (
    <div className="font-semibold ">
      <span
        className={`mr-2 font-semibold tracking-widest ${
          {
            low: 'text-emerald-500',
            medium: 'text-yellow-500',
            high: 'text-red-500'
          }[entry.priority]
        }`}
      >
        {'!'.repeat(['low', 'medium', 'high'].indexOf(entry.priority) + 1)}
      </span>
      {entry.summary}
    </div>
  )
}

export default TaskHeader
