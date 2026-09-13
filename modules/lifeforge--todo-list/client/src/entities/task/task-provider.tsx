import { type UseQueryResult, useQuery } from '@tanstack/react-query'
import { parseAsString, useQueryState } from 'nuqs'
import { type ReactNode, createContext, useContext, useState } from 'react'

import type { TaskList } from '@/entities/list'
import type { TaskPriority } from '@/entities/priority'
import type { TaskTag } from '@/entities/tag'
import type { Task } from '@/entities/task'
import { forgeAPI } from '@/manifest'

type TaskFilter = {
  status: string | null
  tag: string | null
  list: string | null
  priority: string | null
}

type TaskFilterKey = keyof TaskFilter

export type TodoListStatusCounter = {
  all: number
  today: number
  scheduled: number
  overdue: number
  completed: number
}

type TodoListContextValue = {
  prioritiesQuery: UseQueryResult<TaskPriority[]>
  listsQuery: UseQueryResult<TaskList[]>
  tagsListQuery: UseQueryResult<TaskTag[]>
  entriesQuery: UseQueryResult<Task[]>
  statusCounterQuery: UseQueryResult<TodoListStatusCounter>
  filter: TaskFilter
  selectedTask: Task | null
  modifyTaskWindowOpenType: 'create' | 'update' | null
  setModifyTaskWindowOpenType: (value: 'create' | 'update' | null) => void
  setSelectedTask: (value: Task | null) => void
  setFilter: (key: TaskFilterKey, value: string | null) => void
}

export const TodoListContext = createContext<TodoListContextValue | undefined>(
  undefined
)

export function TodoListProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useQueryState('status', parseAsString)
  const [tag, setTag] = useQueryState('tag', parseAsString)
  const [list, setList] = useQueryState('list', parseAsString)
  const [priority, setPriority] = useQueryState('priority', parseAsString)

  const filter: TaskFilter = { status, tag, list, priority }
  const filterSetters = {
    status: setStatus,
    tag: setTag,
    list: setList,
    priority: setPriority
  }

  const statusCounterQuery = useQuery(
    forgeAPI.entries.getStatusCounter.queryOptions()
  )

  const prioritiesQuery = useQuery(forgeAPI.priorities.list.queryOptions())
  const listsQuery = useQuery(forgeAPI.lists.list.queryOptions())
  const tagsListQuery = useQuery(forgeAPI.tags.list.queryOptions())

  const entriesQuery = useQuery(
    forgeAPI.entries.list
      .input({
        status: filter.status ?? 'all',
        tag: filter.tag ?? undefined,
        list: filter.list ?? undefined,
        priority: filter.priority ?? undefined
      })
      .queryOptions()
  )

  const [taskWindow, setTaskWindow] = useQueryState('task', parseAsString)

  const modifyTaskWindowOpenType: 'create' | 'update' | null =
    taskWindow === 'create' || taskWindow === 'update'
      ? (taskWindow as 'create' | 'update')
      : null

  function setModifyTaskWindowOpenType(value: 'create' | 'update' | null) {
    void setTaskWindow(value)
  }

  const [selectedTaskId, setSelectedTaskId] = useQueryState(
    'taskId',
    parseAsString
  )
  const selectedTaskQuery = useQuery(
    forgeAPI.entries.getById.input({ id: selectedTaskId ?? '' }).queryOptions({
      enabled: selectedTaskId !== null,
      queryKey: [...forgeAPI.entries.getById.key, selectedTaskId]
    })
  )

  const [selectedTaskState, setSelectedTaskState] = useState<Task | null>(null)

  const selectedTask =
    selectedTaskState?.id === selectedTaskId
      ? selectedTaskState
      : (selectedTaskQuery.data ?? null)

  function setSelectedTask(value: Task | null) {
    setSelectedTaskState(value)
    void setSelectedTaskId(value?.id ?? null)
  }

  const value: TodoListContextValue = {
    prioritiesQuery,
    listsQuery,
    tagsListQuery,
    entriesQuery,
    statusCounterQuery,
    filter,
    selectedTask,
    modifyTaskWindowOpenType,
    setModifyTaskWindowOpenType,
    setSelectedTask,
    setFilter: (key, value) => {
      void filterSetters[key](value)
    }
  }

  return <TodoListContext value={value}>{children}</TodoListContext>
}

export function useTodoListContext(): TodoListContextValue {
  const context = useContext(TodoListContext)

  if (context === undefined) {
    throw new Error('useTodoListContext must be used within a TodoListProvider')
  }

  return context
}
