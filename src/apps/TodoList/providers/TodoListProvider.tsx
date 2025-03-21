/* eslint-disable sonarjs/use-type-alias */
import { UseQueryResult } from '@tanstack/react-query'
import { createContext, useContext, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router'

import {
  type ITodoListEntry,
  type ITodoListList,
  type ITodoListStatusCounter,
  type ITodoListTag,
  type ITodoPriority
} from '@apps/TodoList/interfaces/todo_list_interfaces'

import useAPIQuery from '@hooks/useAPIQuery'

interface ITodoListData {
  entriesQueryKey: unknown[]
  // Data
  prioritiesQuery: UseQueryResult<ITodoPriority[]>
  listsQuery: UseQueryResult<ITodoListList[]>
  tagsListQuery: UseQueryResult<ITodoListTag[]>
  entriesQuery: UseQueryResult<ITodoListEntry[]>
  statusCounterQuery: UseQueryResult<ITodoListStatusCounter>

  selectedTask: ITodoListEntry | null
  selectedPriority: ITodoPriority | null
  selectedList: ITodoListList | null
  selectedTag: ITodoListTag | null

  // Modals
  modifyTaskWindowOpenType: 'create' | 'update' | null
  modifyPriorityModalOpenType: 'create' | 'update' | null
  modifyListModalOpenType: 'create' | 'update' | null
  modifyTagModalOpenType: 'create' | 'update' | null
  deleteTaskConfirmationModalOpen: boolean
  deletePriorityConfirmationModalOpen: boolean
  deleteListConfirmationModalOpen: boolean
  deleteTagConfirmationModalOpen: boolean

  // Setters
  setModifyTaskWindowOpenType: React.Dispatch<
    React.SetStateAction<'create' | 'update' | null>
  >
  setModifyPriorityModalOpenType: React.Dispatch<
    React.SetStateAction<'create' | 'update' | null>
  >
  setModifyListModalOpenType: React.Dispatch<
    React.SetStateAction<'create' | 'update' | null>
  >
  setModifyTagModalOpenType: React.Dispatch<
    React.SetStateAction<'create' | 'update' | null>
  >
  setDeleteTaskConfirmationModalOpen: React.Dispatch<
    React.SetStateAction<boolean>
  >
  setDeletePriorityConfirmationModalOpen: React.Dispatch<
    React.SetStateAction<boolean>
  >
  setDeleteListConfirmationModalOpen: React.Dispatch<
    React.SetStateAction<boolean>
  >
  setDeleteTagConfirmationModalOpen: React.Dispatch<
    React.SetStateAction<boolean>
  >
  setSelectedTask: React.Dispatch<React.SetStateAction<ITodoListEntry | null>>
  setSelectedList: React.Dispatch<React.SetStateAction<ITodoListList | null>>
  setSelectedPriority: React.Dispatch<
    React.SetStateAction<ITodoPriority | null>
  >
  setSelectedTag: React.Dispatch<React.SetStateAction<ITodoListTag | null>>
}

export const TodoListContext = createContext<ITodoListData | undefined>(
  undefined
)

export function TodoListProvider({ children }: { children: React.ReactNode }) {
  const [searchParams] = useSearchParams()
  const statusCounterQuery = useAPIQuery<ITodoListStatusCounter>(
    'todo-list/entries/status-counter',
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
  const [modifyPriorityModalOpenType, setModifyPriorityModalOpenType] =
    useState<'create' | 'update' | null>(null)
  const [
    deletePriorityConfirmationModalOpen,
    setDeletePriorityConfirmationModalOpen
  ] = useState(false)
  const [selectedPriority, setSelectedPriority] =
    useState<ITodoPriority | null>(null)
  const [modifyListModalOpenType, setModifyListModalOpenType] = useState<
    'create' | 'update' | null
  >(null)
  const [deleteListConfirmationModalOpen, setDeleteListConfirmationModalOpen] =
    useState(false)
  const [selectedList, setSelectedList] = useState<ITodoListList | null>(null)
  const [modifyTagModalOpenType, setModifyTagModalOpenType] = useState<
    'create' | 'update' | null
  >(null)
  const [deleteTagConfirmationModalOpen, setDeleteTagConfirmationModalOpen] =
    useState(false)
  const [selectedTag, setSelectedTag] = useState<ITodoListTag | null>(null)

  const value = useMemo(
    () => ({
      entriesQueryKey,
      prioritiesQuery,
      listsQuery,
      tagsListQuery,
      entriesQuery,
      statusCounterQuery,
      prioritiesLoading: prioritiesQuery.isLoading,
      listsLoading: listsQuery.isLoading,
      tagsLoading: tagsListQuery.isLoading,
      entriesLoading: entriesQuery.isLoading,
      statusCounterLoading: statusCounterQuery.isLoading,
      selectedTask,
      selectedPriority,
      selectedList,
      selectedTag,
      modifyTaskWindowOpenType,
      modifyPriorityModalOpenType,
      modifyListModalOpenType,
      modifyTagModalOpenType,
      deleteTaskConfirmationModalOpen,
      deletePriorityConfirmationModalOpen,
      deleteListConfirmationModalOpen,
      deleteTagConfirmationModalOpen,
      setModifyTaskWindowOpenType,
      setModifyPriorityModalOpenType,
      setModifyListModalOpenType,
      setModifyTagModalOpenType,
      setDeleteTaskConfirmationModalOpen,
      setDeletePriorityConfirmationModalOpen,
      setDeleteListConfirmationModalOpen,
      setDeleteTagConfirmationModalOpen,
      setSelectedTask,
      setSelectedList,
      setSelectedPriority,
      setSelectedTag
    }),
    [
      entriesQueryKey,
      prioritiesQuery.data,
      listsQuery.data,
      tagsListQuery.data,
      entriesQuery.data,
      statusCounterQuery.data,
      prioritiesQuery.isLoading,
      listsQuery.isLoading,
      tagsListQuery.isLoading,
      entriesQuery.isLoading,
      statusCounterQuery.isLoading,
      selectedTask,
      selectedPriority,
      selectedList,
      selectedTag,
      modifyTaskWindowOpenType,
      modifyPriorityModalOpenType,
      modifyListModalOpenType,
      modifyTagModalOpenType,
      deleteTaskConfirmationModalOpen,
      deletePriorityConfirmationModalOpen,
      deleteListConfirmationModalOpen,
      deleteTagConfirmationModalOpen
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
