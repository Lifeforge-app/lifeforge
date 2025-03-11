import { useTodoListContext } from '@providers/TodoListProvider'
import React from 'react'

import { type ITodoListEntry } from '@interfaces/todo_list_interfaces'

function TaskHeader({ entry }: { entry: ITodoListEntry }): React.ReactElement {
  const { priorities } = useTodoListContext()

  if (typeof priorities === 'string') return <></>

  return (
    <div className="flex items-center gap-2 font-semibold">
      <span>{entry.summary}</span>
      {entry.priority !== '' && (
        <span
          className="-mb-1 block size-2 shrink-0 rounded-full"
          style={{
            backgroundColor:
              priorities.find(p => p.id === entry.priority)?.color ??
              'lightgray'
          }}
        />
      )}
    </div>
  )
}

export default TaskHeader
