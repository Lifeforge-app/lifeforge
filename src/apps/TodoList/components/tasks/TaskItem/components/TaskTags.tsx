import { useTodoListContext } from '@apps/TodoList/providers/TodoListProvider'

import { type ITodoListEntry } from '../../../../interfaces/todo_list_interfaces'

function TaskTags({ entry }: { entry: ITodoListEntry }) {
  const { tagsListQuery } = useTodoListContext()

  const tags = tagsListQuery.data ?? []

  return (
    <div className="flex w-full min-w-0 items-center gap-1">
      {entry.tags?.length > 0 &&
        entry.tags.slice(0, 3).map(tag => (
          <span
            key={tag}
            className="text-custom-500 relative isolate truncate px-2 py-0.5 text-xs whitespace-nowrap"
          >
            <div className="bg-custom-500 absolute top-0 left-0 z-[-1] size-full rounded-full opacity-20" />
            #{tags.find(t => t.id === tag)?.name}
          </span>
        ))}
      {entry.tags?.length > 3 && (
        <span className="text-bg-500 shrink-0 text-xs">
          +{entry.tags.length - 3} more
        </span>
      )}
    </div>
  )
}

export default TaskTags
