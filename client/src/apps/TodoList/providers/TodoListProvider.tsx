import { type UseQueryResult, useQuery } from '@tanstack/react-query'
import forgeAPI from '@utils/forgeAPI'
import { createContext, useContext, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router'
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
  entriesQueryKey: unknown[]
  // Data
  prioritiesQuery: UseQueryResult<TodoListPriority[]>
  listsQuery: UseQueryResult<TodoListList[]>
  tagsListQuery: UseQueryResult<TodoListTag[]>
  entriesQuery: UseQueryResult<TodoListEntry[]>
  statusCounterQuery: UseQueryResult<TodoListStatusCounter>

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
}

export const TodoListContext = createContext<ITodoListData | undefined>(
  undefined
)

export function TodoListProvider({ children }: { children: React.ReactNode }) {
  const [searchParams] = useSearchParams()

  const statusCounterQuery = useQuery(
    forgeAPI.todoList.entries.getStatusCounter.queryOptions()
  )

  const prioritiesQuery = useQuery(
    forgeAPI.todoList.priorities.list.queryOptions()
  )

  const listsQuery = useQuery(forgeAPI.todoList.lists.list.queryOptions())

  const tagsListQuery = useQuery(forgeAPI.todoList.tags.list.queryOptions())

  const entriesQueryKey = useMemo(
    () => [
      'todo-list',
      'entries',
      searchParams.get('status') ?? '',
      searchParams.get('tag') ?? '',
      searchParams.get('list') ?? '',
      searchParams.get('priority') ?? ''
    ],
    [searchParams]
  )

  const entriesQuery = useQuery(
    forgeAPI.todoList.entries.list
      .input({
        status: searchParams.get('status') ?? 'all',
        tag: searchParams.get('tag') ?? undefined,
        list: searchParams.get('list') ?? undefined,
        priority: searchParams.get('priority') ?? undefined
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
      entriesQueryKey,
      prioritiesQuery,
      listsQuery,
      tagsListQuery,
      entriesQuery,
      statusCounterQuery,
      selectedTask,
      modifyTaskWindowOpenType,
      setModifyTaskWindowOpenType,
      setDeleteTaskConfirmationModalOpen,
      setSelectedTask
    }),
    [
      entriesQueryKey,
      prioritiesQuery,
      listsQuery,
      tagsListQuery,
      entriesQuery,
      statusCounterQuery,
      selectedTask,
      modifyTaskWindowOpenType,
      deleteTaskConfirmationModalOpen
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
