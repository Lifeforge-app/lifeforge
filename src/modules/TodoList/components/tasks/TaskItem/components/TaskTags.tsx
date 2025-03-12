import { useTodoListContext } from '@modules/TodoList/providers/TodoListProvider'

import { type ITodoListEntry } from '../../../../interfaces/todo_list_interfaces'

function TaskTags({ entry }: { entry: ITodoListEntry }) {
  const { tags } = useTodoListContext()

  return (
    <div className="flex items-center gap-1">
      {typeof tags !== 'string' &&
        entry.tags?.length > 0 &&
        entry.tags.map(tag => (
          <span
            key={tag}
            className="text-custom-500 relative isolate px-2 py-0.5 text-xs"
          >
            <div className="bg-custom-500 absolute left-0 top-0 z-[-1] size-full rounded-full opacity-20" />
            #{tags.find(t => t.id === tag)?.name}
          </span>
        ))}
    </div>
  )
}

export default TaskTags
