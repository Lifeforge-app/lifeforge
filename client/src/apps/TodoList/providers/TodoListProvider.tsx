import { UseQueryResult } from '@tanstack/react-query'
import { createContext, useContext, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router'

import { useAPIQuery } from 'shared/lib'

import {
  type ITodoListEntry,
  type ITodoListList,
  type ITodoListStatusCounter,
  type ITodoListTag,
  type ITodoPriority
} from '@apps/TodoList/interfaces/todo_list_interfaces'

interface ITodoListData {
  entriesQueryKey: unknown[]
  // Data
  prioritiesQuery: UseQueryResult<ITodoPriority[]>
  listsQuery: UseQueryResult<ITodoListList[]>
  tagsListQuery: UseQueryResult<ITodoListTag[]>
  entriesQuery: UseQueryResult<ITodoListEntry[]>
  statusCounterQuery: UseQueryResult<ITodoListStatusCounter>

  selectedTask: ITodoListEntry | null

  // Modals
  modifyTaskWindowOpenType: 'create' | 'update' | null

  // Setters
  setModifyTaskWindowOpenType: React.Dispatch<
    React.SetStateAction<'create' | 'update' | null>
  >
  setSelectedTask: React.Dispatch<React.SetStateAction<ITodoListEntry | null>>
}

export const TodoListContext = createContext<ITodoListData | undefined>(
  undefined
)

export function TodoListProvider({ children }: { children: React.ReactNode }) {
  const [searchParams] = useSearchParams()

  const statusCounterQuery = useAPIQuery<ITodoListStatusCounter>(
    'todo-list/entries/utils/status-counter',
    ['todo-list', 'entries', 'status-counter']
  )

  const prioritiesQuery = useAPIQuery<ITodoPriority[]>('todo-list/priorities', [
    'todo-list',
    'priorities'
  ])

  const listsQuery = useAPIQuery<ITodoListList[]>('todo-list/lists', [
    'todo-list',
    'lists'
  ])

  const tagsListQuery = useAPIQuery<ITodoListTag[]>('todo-list/tags', [
    'todo-list',
    'tags'
  ])

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

  const entriesQuery = useAPIQuery<ITodoListEntry[]>(
    `todo-list/entries?${
      searchParams.get('status') !== null &&
      `status=${searchParams.get('status')}`
    }&tag=${searchParams.get('tag') ?? ''}&list=${
      searchParams.get('list') ?? ''
    }&priority=${searchParams.get('priority') ?? ''}`,
    entriesQueryKey
  )

  const [modifyTaskWindowOpenType, setModifyTaskWindowOpenType] = useState<
    'create' | 'update' | null
  >(null)

  const [deleteTaskConfirmationModalOpen, setDeleteTaskConfirmationModalOpen] =
    useState(false)

  const [selectedTask, setSelectedTask] = useState<ITodoListEntry | null>(null)

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
