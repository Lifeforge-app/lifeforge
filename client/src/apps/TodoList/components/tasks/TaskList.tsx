import { Scrollbar } from 'lifeforge-ui'

import { ITodoListEntry } from '@apps/TodoList/interfaces/todo_list_interfaces'

import TaskItem from './TaskItem'

function TaskList({ entries }: { entries: ITodoListEntry[] }) {
  return (
    <div className="mt-4 flex flex-1 flex-col">
      <Scrollbar>
        <ul className="flex flex-1 flex-col gap-2 px-4 pb-8">
          {entries.map(entry => (
            <TaskItem key={entry.id} entry={entry} />
          ))}
        </ul>
      </Scrollbar>
    </div>
  )
}

export default TaskList
