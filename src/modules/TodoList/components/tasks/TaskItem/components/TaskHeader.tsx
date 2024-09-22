import React from 'react'
import { type ITodoListEntry } from '@interfaces/todo_list_interfaces'
import { useTodoListContext } from '@providers/TodoListProvider'

function TaskHeader({ entry }: { entry: ITodoListEntry }): React.ReactElement {
  const { priorities } = useTodoListContext()

  if (typeof priorities === 'string') return <></>

  return (
    <div className="flex items-center gap-2 font-semibold">
      {entry.summary}
      {entry.priority !== '' && (
        <span
          className="block size-2 shrink-0 rounded-full"
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
