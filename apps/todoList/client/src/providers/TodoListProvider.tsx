import forgeAPI from '@/utils/forgeAPI'
import { type UseQueryResult, useQuery } from '@tanstack/react-query'
import { createContext, useContext, useMemo, useState } from 'react'
import type { InferOutput } from 'shared'

export type TodoListEntry = InferOutput<
  typeof forgeAPI.todoList.entries.getById
>

export type TodoListPriority = InferOutput<
  typeof forgeAPI.todoList.priorities.list
>[number]

export type TodoListList = InferOutput<
  typeof forgeAPI.todoList.lists.list
>[number]

export type TodoListTag = InferOutput<
  typeof forgeAPI.todoList.tags.list
>[number]

export type TodoListStatusCounter = InferOutput<
  typeof forgeAPI.todoList.entries.getStatusCounter
>

interface ITodoListData {
  // Data
  prioritiesQuery: UseQueryResult<TodoListPriority[]>
  listsQuery: UseQueryResult<TodoListList[]>
  tagsListQuery: UseQueryResult<TodoListTag[]>
  entriesQuery: UseQueryResult<TodoListEntry[]>
  statusCounterQuery: UseQueryResult<TodoListStatusCounter>

  // State
  filter: {
    status: string | null
    tag: string | null
    list: string | null
    priority: string | null
  }
  selectedTask: InferOutput<typeof forgeAPI.todoList.entries.getById> | null

  // Modals
  modifyTaskWindowOpenType: 'create' | 'update' | null

  // Setters
  setModifyTaskWindowOpenType: React.Dispatch<
    React.SetStateAction<'create' | 'update' | null>
  >
  setSelectedTask: React.Dispatch<
    React.SetStateAction<InferOutput<
      typeof forgeAPI.todoList.entries.getById
    > | null>
  >
  setFilter: (
    key: 'status' | 'tag' | 'list' | 'priority',
    value: string | null
  ) => void
}

export const TodoListContext = createContext<ITodoListData | undefined>(
  undefined
)

export function TodoListProvider({ children }: { children: React.ReactNode }) {
  const [filter, setFilter] = useState<{
    status: string | null
    tag: string | null
    list: string | null
    priority: string | null
  }>({
    status: null,
    tag: null,
    list: null,
    priority: null
  })

  const statusCounterQuery = useQuery(
    forgeAPI.todoList.entries.getStatusCounter.queryOptions()
  )

  const prioritiesQuery = useQuery(
    forgeAPI.todoList.priorities.list.queryOptions()
  )

  const listsQuery = useQuery(forgeAPI.todoList.lists.list.queryOptions())

  const tagsListQuery = useQuery(forgeAPI.todoList.tags.list.queryOptions())

  const entriesQuery = useQuery(
    forgeAPI.todoList.entries.list
      .input({
        status: filter.status ?? 'all',
        tag: filter.tag ?? undefined,
        list: filter.list ?? undefined,
        priority: filter.priority ?? undefined
      })
      .queryOptions()
  )

  const [modifyTaskWindowOpenType, setModifyTaskWindowOpenType] = useState<
    'create' | 'update' | null
  >(null)

  const [deleteTaskConfirmationModalOpen, setDeleteTaskConfirmationModalOpen] =
    useState(false)

  const [selectedTask, setSelectedTask] = useState<InferOutput<
    typeof forgeAPI.todoList.entries.getById
  > | null>(null)

  const value = useMemo(
    () => ({
      prioritiesQuery,
      listsQuery,
      tagsListQuery,
      entriesQuery,
      statusCounterQuery,
      filter,
      selectedTask,
      modifyTaskWindowOpenType,
      setModifyTaskWindowOpenType,
      setDeleteTaskConfirmationModalOpen,
      setSelectedTask,
      setFilter: (key: keyof typeof filter, value: string | null) => {
        setFilter(prev => ({
          ...prev,
          [key]: value
        }))
      }
    }),
    [
      prioritiesQuery,
      listsQuery,
      tagsListQuery,
      entriesQuery,
      statusCounterQuery,
      selectedTask,
      modifyTaskWindowOpenType,
      deleteTaskConfirmationModalOpen,
      filter
    ]
  )

  return <TodoListContext value={value}>{children}</TodoListContext>
}

export function useTodoListContext(): ITodoListData {
  const context = useContext(TodoListContext)

  if (context === undefined) {
    throw new Error('useTodoListContext must be used within a TodoListProvider')
  }

  return context
}
