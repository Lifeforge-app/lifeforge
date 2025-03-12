import { Scrollbar } from '@lifeforge/ui'

import { useTodoListContext } from '@modules/TodoList/providers/TodoListProvider'

import TaskItem from './TaskItem'

function TaskList() {
  const { entries } = useTodoListContext()

  return (
    <div className="mt-4 flex flex-1 flex-col">
      <Scrollbar>
        {typeof entries !== 'string' && entries.length > 0 && (
          <ul className="flex flex-1 flex-col gap-4 px-4 pb-8">
            {entries.map(entry => (
              <TaskItem key={entry.id} entry={entry} />
            ))}
          </ul>
        )}
      </Scrollbar>
    </div>
  )
}

export default TaskList
