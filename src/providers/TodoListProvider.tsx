import React, { useContext, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router'
import useFetch from '@hooks/useFetch'
import { Loadable } from '@interfaces/common'
import {
  type ITodoListEntry,
  type ITodoListList,
  type ITodoListStatusCounter,
  type ITodoListTag,
  type ITodoPriority
} from '../interfaces/todo_list_interfaces'

interface ITodoListData {
  // Data
  priorities: Loadable<ITodoPriority[]>
  lists: Loadable<ITodoListList[]>
  tags: Loadable<ITodoListTag[]>
  entries: Loadable<ITodoListEntry[]>
  statusCounter: Loadable<ITodoListStatusCounter>
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

  // Refresh Functions
  refreshPriorities: () => void
  refreshLists: () => void
  refreshTagsList: () => void
  refreshEntries: () => void
  refreshStatusCounter: () => void

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
  setEntries: React.Dispatch<React.SetStateAction<Loadable<ITodoListEntry[]>>>
}

export const TodoListContext = React.createContext<ITodoListData | undefined>(
  undefined
)

export function TodoListProvider({
  children
}: {
  children: React.ReactNode
}): React.ReactElement {
  const [searchParams] = useSearchParams()
  const [statusCounter, refreshStatusCounter] =
    useFetch<ITodoListStatusCounter>('todo-list/entries/status-counter')
  const [priorities, refreshPriorities] = useFetch<ITodoPriority[]>(
    'todo-list/priorities'
  )
  const [lists, refreshLists] = useFetch<ITodoListList[]>('todo-list/lists')
  const [tagsList, refreshTagsList] = useFetch<ITodoListTag[]>('todo-list/tags')
  const [entries, refreshEntries, setEntries] = useFetch<ITodoListEntry[]>(
    `todo-list/entries?${
      searchParams.get('status') !== null &&
      `status=${searchParams.get('status')}`
    }&tag=${searchParams.get('tag') ?? ''}&list=${
      searchParams.get('list') ?? ''
    }&priority=${searchParams.get('priority') ?? ''}`
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
      priorities,
      lists,
      tags: tagsList,
      entries,
      statusCounter,
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
      refreshLists,
      refreshPriorities,
      refreshTagsList,
      refreshEntries,
      refreshStatusCounter,
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
      setSelectedTag,
      setEntries
    }),
    [
      priorities,
      lists,
      tagsList,
      entries,
      statusCounter,
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
