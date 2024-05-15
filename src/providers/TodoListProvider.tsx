/* eslint-disable @typescript-eslint/indent */
import React, { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import useFetch from '@hooks/useFetch'
import {
  type ITodoListList,
  type ITodoListTag,
  type ITodoListEntry,
  type ITodoListStatusCounter
} from '@typedec/TodoList'

const TODO_LIST_DATA: {
  lists: ITodoListList[] | 'loading' | 'error'
  tags: ITodoListTag[] | 'loading' | 'error'
  entries: ITodoListEntry[] | 'loading' | 'error'
  statusCounter: ITodoListStatusCounter | 'loading' | 'error'
  modifyTaskWindowOpenType: 'create' | 'update' | null
  modifyListModalOpenType: 'create' | 'update' | null
  modifyTagModalOpenType: 'create' | 'update' | null
  deleteTaskConfirmationModalOpen: boolean
  deleteListConfirmationModalOpen: boolean
  deleteTagConfirmationModalOpen: boolean
  selectedTask: ITodoListEntry | null
  selectedList: ITodoListList | null
  selectedTag: ITodoListTag | null
  refreshLists: () => void
  refreshTagsList: () => void
  refreshEntries: () => void
  refreshStatusCounter: () => void
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
} = {
  lists: 'loading',
  tags: 'loading',
  entries: 'loading',
  statusCounter: 'loading',
  modifyTaskWindowOpenType: null,
  modifyListModalOpenType: null,
  modifyTagModalOpenType: null,
  deleteTaskConfirmationModalOpen: false,
  deleteListConfirmationModalOpen: false,
  deleteTagConfirmationModalOpen: false,
  selectedTask: null,
  selectedList: null,
  selectedTag: null,
  refreshLists: () => {},
  refreshTagsList: () => {},
  refreshEntries: () => {},
  refreshStatusCounter: () => {},
  setModifyTaskWindowOpenType: () => {},
  setModifyListModalOpenType: () => {},
  setModifyTagModalOpenType: () => {},
  setDeleteTaskConfirmationModalOpen: () => {},
  setDeleteListConfirmationModalOpen: () => {},
  setDeleteTagConfirmationModalOpen: () => {},
  setSelectedTask: () => {},
  setSelectedList: () => {},
  setSelectedTag: () => {},
  setEntries: () => {}
}

export const TodoListContext = React.createContext(TODO_LIST_DATA)

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
    `todo-list/entry/list?status=${searchParams.get('status') ?? ''}&tag=${
      searchParams.get('tag') ?? ''
    }&list=${searchParams.get('list') ?? ''}`
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
    <TodoListContext.Provider
      value={{
        lists,
        tags: tagsList,
        entries,
        statusCounter,
        modifyTaskWindowOpenType,
        modifyListModalOpenType,
        modifyTagModalOpenType,
        deleteTaskConfirmationModalOpen,
        deleteListConfirmationModalOpen,
        deleteTagConfirmationModalOpen,
        selectedTask,
        selectedList,
        selectedTag,
        refreshLists,
        refreshTagsList,
        refreshEntries,
        refreshStatusCounter,
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
    </TodoListContext.Provider>
  )
}
