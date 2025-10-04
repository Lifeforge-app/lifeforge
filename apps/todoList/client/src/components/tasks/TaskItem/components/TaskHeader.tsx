import {
  type TodoListEntry,
  useTodoListContext
} from '@/providers/TodoListProvider'

function TaskHeader({ entry }: { entry: TodoListEntry }) {
  const { prioritiesQuery } = useTodoListContext()

  const priorities = prioritiesQuery.data ?? []

  return (
    <div className="flex w-full min-w-0 items-center gap-2 font-semibold">
      <span className="min-w-0 truncate">{entry.summary}</span>
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
