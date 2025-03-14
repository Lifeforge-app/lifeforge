import { useTodoListContext } from '@modules/TodoList/providers/TodoListProvider'

import { type ITodoListEntry } from '../../../../interfaces/todo_list_interfaces'

function TaskHeader({ entry }: { entry: ITodoListEntry }) {
  const { priorities } = useTodoListContext()

  if (typeof priorities === 'string') return <></>

  return (
    <div className="flex items-center w-full min-w-0 gap-2 font-semibold">
      <span className="truncate min-w-0">{entry.summary}</span>
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
