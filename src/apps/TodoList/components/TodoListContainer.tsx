import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useSearchParams } from 'react-router'
import { toast } from 'react-toastify'

import { EmptyStateScreen, FAB, QueryWrapper, SearchInput } from '@lifeforge/ui'
import { useModalsEffect } from '@lifeforge/ui'

import { useTodoListContext } from '@apps/TodoList/providers/TodoListProvider'

import fetchAPI from '@utils/fetchAPI'

import { ITodoListEntry } from '../interfaces/todo_list_interfaces'
import { todoListModals } from '../modals'
import Header from './Header'
import ModifyTaskWindow from './ModifyTaskWindow'
import Sidebar from './Sidebar'
import TaskList from './tasks/TaskList'

function TodoListContainer() {
  const { t } = useTranslation('apps.todoList')
  const [searchParams, setSearchParams] = useSearchParams()
  const { entriesQuery, setModifyTaskWindowOpenType, setSelectedTask } =
    useTodoListContext()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const { hash } = useLocation()

  async function fetchAndSetTask(id: string) {
    try {
      const data = await fetchAPI<ITodoListEntry>(`todo-list/entries/${id}`)

      setSelectedTask(data)
      setModifyTaskWindowOpenType('update')
    } catch (error) {
      console.error('Error fetching entry:', error)
      toast.error('Error fetching entry')
    }
  }

  useEffect(() => {
    if (hash === '#new') {
      setSelectedTask(null)
      setModifyTaskWindowOpenType('create')
    }
  }, [hash])

  useEffect(() => {
    const id = searchParams.get('entry')
    if (id) {
      fetchAndSetTask(id)
      const newSearchParams = new URLSearchParams(searchParams)
      newSearchParams.delete('entry')
      setSearchParams(newSearchParams, { replace: true })
    }
    const status = searchParams.get('status')
    if (status === null || status === '') return
    if (
      !['all', 'today', 'scheduled', 'overdue', 'completed'].includes(status)
    ) {
      setSearchParams({
        ...Object.fromEntries(searchParams.entries()),
        status: 'all'
      })
    }
  }, [searchParams, entriesQuery.data])

  useModalsEffect(todoListModals)

  return (
    <>
      <div className="mt-6 flex size-full min-h-0 flex-1">
        <Sidebar isOpen={sidebarOpen} setOpen={setSidebarOpen} />
        <div className="relative z-10 flex h-full flex-1 flex-col xl:ml-8">
          <Header setSidebarOpen={setSidebarOpen} />
          <div className="w-full px-4">
            <SearchInput
              namespace="apps.todoList"
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              stuffToSearch="task"
            />
          </div>
          <QueryWrapper query={entriesQuery}>
            {entries =>
              entries.length > 0 ? (
                <TaskList />
              ) : (
                <EmptyStateScreen
                  ctaContent="new"
                  ctaTProps={{
                    item: t('items.task')
                  }}
                  icon="tabler:article-off"
                  name="tasks"
                  namespace="apps.todoList"
                  onCTAClick={setModifyTaskWindowOpenType}
                />
              )
            }
          </QueryWrapper>
        </div>
      </div>
      <ModifyTaskWindow />
      {(entriesQuery.data ?? []).length > 0 && (
        <FAB
          onClick={() => {
            setSelectedTask(null)
            setModifyTaskWindowOpenType('create')
          }}
        />
      )}
    </>
  )
}

export default TodoListContainer
