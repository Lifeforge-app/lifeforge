import { UseQueryResult } from '@tanstack/react-query'
import { createContext, useContext, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router'

import { useAPIQuery } from 'shared/lib'
import {
  ISchemaWithPB,
  TodoListCollectionsSchemas
} from 'shared/types/collections'
import { TodoListControllersSchemas } from 'shared/types/controllers'

interface ITodoListData {
  entriesQueryKey: unknown[]
  // Data
  prioritiesQuery: UseQueryResult<
    TodoListControllersSchemas.IPriorities['getAllPriorities']['response']
  >
  listsQuery: UseQueryResult<
    TodoListControllersSchemas.ILists['getAllLists']['response']
  >
  tagsListQuery: UseQueryResult<
    TodoListControllersSchemas.ITags['getAllTags']['response']
  >
  entriesQuery: UseQueryResult<
    TodoListControllersSchemas.IEntries['getAllEntries']['response']
  >
  statusCounterQuery: UseQueryResult<
    TodoListControllersSchemas.IEntries['getStatusCounter']['response']
  >

  selectedTask: ISchemaWithPB<TodoListCollectionsSchemas.IEntry> | null

  // Modals
  modifyTaskWindowOpenType: 'create' | 'update' | null

  // Setters
  setModifyTaskWindowOpenType: React.Dispatch<
    React.SetStateAction<'create' | 'update' | null>
  >
  setSelectedTask: React.Dispatch<
    React.SetStateAction<ISchemaWithPB<TodoListCollectionsSchemas.IEntry> | null>
  >
}

export const TodoListContext = createContext<ITodoListData | undefined>(
  undefined
)

export function TodoListProvider({ children }: { children: React.ReactNode }) {
  const [searchParams] = useSearchParams()

  const statusCounterQuery = useAPIQuery<
    TodoListControllersSchemas.IEntries['getStatusCounter']['response']
  >('todo-list/entries/utils/status-counter', [
    'todo-list',
    'entries',
    'status-counter'
  ])

  const prioritiesQuery = useAPIQuery<
    TodoListControllersSchemas.IPriorities['getAllPriorities']['response']
  >('todo-list/priorities', ['todo-list', 'priorities'])

  const listsQuery = useAPIQuery<
    TodoListControllersSchemas.ILists['getAllLists']['response']
  >('todo-list/lists', ['todo-list', 'lists'])

  const tagsListQuery = useAPIQuery<
    TodoListControllersSchemas.ITags['getAllTags']['response']
  >('todo-list/tags', ['todo-list', 'tags'])

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

  const entriesQuery = useAPIQuery<
    TodoListControllersSchemas.IEntries['getAllEntries']['response']
  >(
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

  const [selectedTask, setSelectedTask] =
    useState<ISchemaWithPB<TodoListCollectionsSchemas.IEntry> | null>(null)

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
