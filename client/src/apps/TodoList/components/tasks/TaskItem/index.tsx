import { useQueryClient } from '@tanstack/react-query'
import forgeAPI from '@utils/forgeAPI'
import clsx from 'clsx'
import { Checkbox } from 'lifeforge-ui'

import {
  type TodoListEntry,
  useTodoListContext
} from '@apps/TodoList/providers/TodoListProvider'

import TaskDueDate from './components/TaskDueDate'
import TaskHeader from './components/TaskHeader'
import TaskTags from './components/TaskTags'

function TaskItem({
  entry,
  lighter,
  isInDashboardWidget
}: {
  entry: TodoListEntry
  lighter?: boolean
  isInDashboardWidget?: boolean
}) {
  const queryClient = useQueryClient()

  const {
    entriesQueryKey,
    entriesQuery,
    statusCounterQuery,
    listsQuery,
    setSelectedTask,
    setModifyTaskWindowOpenType
  } = useTodoListContext()

  const entries = entriesQuery.data ?? []

  const lists = listsQuery.data ?? []

  async function toggleTaskCompletion() {
    queryClient.setQueryData(
      entriesQueryKey,
      entries.map(e =>
        e.id === entry.id
          ? {
              ...e,
              done: !e.done
            }
          : e
      )
    )

    try {
      await forgeAPI.todoList.entries.toggleEntry
        .input({
          id: entry.id
        })
        .mutate({})

      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: entriesQueryKey })
        statusCounterQuery.refetch()
      }, 500)
    } catch {
      queryClient.invalidateQueries({ queryKey: entriesQueryKey })
    }
  }

  return (
    <li
      key={entry.id}
      className={clsx(
        'flex-between shadow-custom relative isolate flex gap-6 rounded-lg p-4 pr-6 pl-5 transition-all',
        lighter ? 'component-bg-lighter' : 'component-bg-with-hover'
      )}
    >
      <div className="flex w-full min-w-0 items-center gap-3">
        {typeof lists !== 'string' && entry.list !== '' && (
          <span
            className="h-10 w-1 shrink-0 rounded-full"
            style={{
              backgroundColor: lists.find(l => l.id === entry.list)?.color
            }}
          />
        )}
        <div className="w-full min-w-0">
          <TaskHeader entry={entry} />
          {(entry.due_date || entry.tags.length > 0) && (
            <div className="mt-1 flex items-center gap-2">
              <TaskDueDate entry={entry} />
              <TaskTags entry={entry} />
            </div>
          )}
        </div>
      </div>
      <Checkbox
        checked={entry.done}
        onChange={() => {
          toggleTaskCompletion()
        }}
      />
      <button
        className="absolute top-0 left-0 size-full"
        onClick={() => {
          if (!isInDashboardWidget) {
            setModifyTaskWindowOpenType('update')
            setSelectedTask(entry)
          }
        }}
      />
    </li>
  )
}

export default TaskItem
