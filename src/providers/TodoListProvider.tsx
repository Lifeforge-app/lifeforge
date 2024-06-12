import React, { useContext, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import useFetch from '@hooks/useFetch'
import {
  type ITodoListList,
  type ITodoListTag,
  type ITodoListEntry,
  type ITodoListStatusCounter
} from '@interfaces/todo_list_interfaces'

interface ITodoListData {
  // Data
  lists: ITodoListList[] | 'loading' | 'error'
  tags: ITodoListTag[] | 'loading' | 'error'
  entries: ITodoListEntry[] | 'loading' | 'error'
  statusCounter: ITodoListStatusCounter | 'loading' | 'error'
  selectedTask: ITodoListEntry | null
  selectedList: ITodoListList | null
  selectedTag: ITodoListTag | null

  // Modals
  modifyTaskWindowOpenType: 'create' | 'update' | null
  modifyListModalOpenType: 'create' | 'update' | null
  modifyTagModalOpenType: 'create' | 'update' | null
  deleteTaskConfirmationModalOpen: boolean
  deleteListConfirmationModalOpen: boolean
  deleteTagConfirmationModalOpen: boolean

  // Refresh Functions
  refreshLists: () => void
  refreshTagsList: () => void
  refreshEntries: () => void
  refreshStatusCounter: () => void

  // Setters
  setModifyTaskWindowOpenType: React.Dispatch<
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
  setDeleteListConfirmationModalOpen: React.Dispatch<
    React.SetStateAction<boolean>
  >
  setDeleteTagConfirmationModalOpen: React.Dispatch<
    React.SetStateAction<boolean>
  >
  setSelectedTask: React.Dispatch<React.SetStateAction<ITodoListEntry | null>>
  setSelectedList: React.Dispatch<React.SetStateAction<ITodoListList | null>>
  setSelectedTag: React.Dispatch<React.SetStateAction<ITodoListTag | null>>
  setEntries: React.Dispatch<
    React.SetStateAction<ITodoListEntry[] | 'loading' | 'error'>
  >
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
    useFetch<ITodoListStatusCounter>('todo-list/entry/status-counter')
  const [lists, refreshLists] = useFetch<ITodoListList[]>('todo-list/list/list')
  const [tagsList, refreshTagsList] =
    useFetch<ITodoListTag[]>('todo-list/tag/list')
  const [entries, refreshEntries, setEntries] = useFetch<ITodoListEntry[]>(
    `todo-list/entry/list?${
      searchParams.get('status') !== null &&
      `status=${searchParams.get('status')}`
    }&tag=${searchParams.get('tag') ?? ''}&list=${
      searchParams.get('list') ?? ''
    }`
  )
  const [modifyTaskWindowOpenType, setModifyTaskWindowOpenType] = useState<
    'create' | 'update' | null
  >(null)
  const [deleteTaskConfirmationModalOpen, setDeleteTaskConfirmationModalOpen] =
    useState(false)
  const [selectedTask, setSelectedTask] = useState<ITodoListEntry | null>(null)
  const [modifyListModalOpenType, setModifyListModalOpenType] = useState<
    'create' | 'update' | null
  >(null)
  const [deleteListConfirmationModalOpen, setDeleteListConfirmationModalOpen] =
    useState<boolean>(false)
  const [selectedList, setSelectedList] = useState<ITodoListList | null>(null)
  const [modifyTagModalOpenType, setModifyTagModalOpenType] = useState<
    'create' | 'update' | null
  >(null)
  const [deleteTagConfirmationModalOpen, setDeleteTagConfirmationModalOpen] =
    useState<boolean>(false)
  const [selectedTag, setSelectedTag] = useState<ITodoListTag | null>(null)

  return (
    <TodoListContext
      value={{
        // Data
        lists,
        tags: tagsList,
        entries,
        statusCounter,
        selectedTask,
        selectedList,
        selectedTag,

        // Modals
        modifyTaskWindowOpenType,
        modifyListModalOpenType,
        modifyTagModalOpenType,
        deleteTaskConfirmationModalOpen,
        deleteListConfirmationModalOpen,
        deleteTagConfirmationModalOpen,

        // Refresh Functions
        refreshLists,
        refreshTagsList,
        refreshEntries,
        refreshStatusCounter,

        // Setters
        setModifyTaskWindowOpenType,
        setModifyListModalOpenType,
        setModifyTagModalOpenType,
        setDeleteTaskConfirmationModalOpen,
        setDeleteListConfirmationModalOpen,
        setDeleteTagConfirmationModalOpen,
        setSelectedTask,
        setSelectedList,
        setSelectedTag,
        setEntries
      }}
    >
      {children}
    </TodoListContext>
  )
}

export function useTodoListContext(): ITodoListData {
  const context = useContext(TodoListContext)
  if (context === undefined) {
    throw new Error('useTodoListContext must be used within a TodoListProvider')
  }
  return context
}
