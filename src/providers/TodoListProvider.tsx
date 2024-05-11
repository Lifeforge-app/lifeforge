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
  deleteTaskConfirmationModalOpen: boolean
  selectedTask: ITodoListEntry | null
  refreshLists: () => void
  refreshTagsList: () => void
  refreshEntries: () => void
  refreshStatusCounter: () => void
  setModifyTaskWindowOpenType: React.Dispatch<
    React.SetStateAction<'create' | 'update' | null>
  >
  setDeleteTaskConfirmationModalOpen: React.Dispatch<
    React.SetStateAction<boolean>
  >
  setSelectedTask: React.Dispatch<React.SetStateAction<ITodoListEntry | null>>
  setEntries: React.Dispatch<
    React.SetStateAction<ITodoListEntry[] | 'loading' | 'error'>
  >
} = {
  lists: 'loading',
  tags: 'loading',
  entries: 'loading',
  statusCounter: 'loading',
  modifyTaskWindowOpenType: null,
  deleteTaskConfirmationModalOpen: false,
  selectedTask: null,
  refreshLists: () => {},
  refreshTagsList: () => {},
  refreshEntries: () => {},
  refreshStatusCounter: () => {},
  setModifyTaskWindowOpenType: () => {},
  setDeleteTaskConfirmationModalOpen: () => {},
  setSelectedTask: () => {},
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

  return (
    <TodoListContext.Provider
      value={{
        lists,
        tags: tagsList,
        entries,
        statusCounter,
        modifyTaskWindowOpenType,
        deleteTaskConfirmationModalOpen,
        selectedTask,
        refreshLists,
        refreshTagsList,
        refreshEntries,
        refreshStatusCounter,
        setModifyTaskWindowOpenType,
        setDeleteTaskConfirmationModalOpen,
        setSelectedTask,
        setEntries
      }}
    >
      {children}
    </TodoListContext.Provider>
  )
}
