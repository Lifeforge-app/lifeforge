import React from 'react'
import { useTodoListContext } from '@providers/TodoListProvider'
import { type ITodoListEntry } from '@typedec/TodoList'

function TaskTags({ entry }: { entry: ITodoListEntry }): React.ReactElement {
  const { tags } = useTodoListContext()

  return (
    <div className="flex items-center gap-1">
      {typeof tags !== 'string' &&
        entry.tags?.length > 0 &&
        entry.tags.map(tag => (
          <span
            key={tag}
            className="relative isolate px-2 py-0.5 text-xs text-custom-500"
          >
            <div className="absolute left-0 top-0 z-[-1] h-full w-full rounded-full bg-custom-500 opacity-20" />
            #{tags.find(t => t.id === tag)?.name}
          </span>
        ))}
    </div>
  )
}

export default TaskTags
