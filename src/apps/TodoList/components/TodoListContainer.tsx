import { useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useSearchParams } from 'react-router'

import {
  DeleteConfirmationModal,
  EmptyStateScreen,
  FAB,
  QueryWrapper,
  SearchInput
} from '@lifeforge/ui'

import { useTodoListContext } from '@apps/TodoList/providers/TodoListProvider'

import ModifyListModal from '../modals/ModifyListModal'
import ModifyPriorityModal from '../modals/ModifyPriorityModal'
import ModifyTagModal from '../modals/ModifyTagModal'
import Header from './Header'
import ModifyTaskWindow from './ModifyTaskWindow'
import Sidebar from './Sidebar'
import TaskList from './tasks/TaskList'

function TodoListContainer() {
  const queryClient = useQueryClient()
  const { t } = useTranslation('apps.todoList')
  const [searchParams, setSearchParams] = useSearchParams()
  const {
    entriesQueryKey,
    entriesQuery,
    setModifyTaskWindowOpenType,
    deleteTaskConfirmationModalOpen,
    setDeleteTaskConfirmationModalOpen,
    selectedTask,
    selectedPriority,
    selectedList,
    selectedTag,
    setSelectedTask,
    deletePriorityConfirmationModalOpen,
    setDeletePriorityConfirmationModalOpen,
    deleteListConfirmationModalOpen,
    setDeleteListConfirmationModalOpen,
    deleteTagConfirmationModalOpen,
    setDeleteTagConfirmationModalOpen
  } = useTodoListContext()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const { hash } = useLocation()

  useEffect(() => {
    if (hash === '#new') {
      setSelectedTask(null)
      setModifyTaskWindowOpenType('create')
    }
  }, [hash])

  useEffect(() => {
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
  }, [searchParams])

  return (
    <>
      <div className="mt-6 flex size-full min-h-0 flex-1">
        <Sidebar isOpen={sidebarOpen} setOpen={setSidebarOpen} />
        <div className="relative z-10 flex h-full flex-1 flex-col xl:ml-8">
          <Header setSidebarOpen={setSidebarOpen} />
          <SearchInput
            namespace="apps.todoList"
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            stuffToSearch="task"
          />
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
      <DeleteConfirmationModal
        apiEndpoint="todo-list/entries"
        data={selectedTask ?? undefined}
        isOpen={deleteTaskConfirmationModalOpen}
        itemName="task"
        nameKey="summary"
        queryKey={entriesQueryKey}
        onClose={() => {
          setDeleteTaskConfirmationModalOpen(false)
          queryClient.invalidateQueries({
            queryKey: ['todo-list', 'priorities']
          })
          queryClient.invalidateQueries({ queryKey: ['todo-list', 'lists'] })
          queryClient.invalidateQueries({ queryKey: ['todo-list', 'tags'] })
          queryClient.invalidateQueries({
            queryKey: ['todo-list', 'status-counter']
          })
        }}
      />
      {(entriesQuery.data ?? []).length > 0 && (
        <FAB
          onClick={() => {
            setSelectedTask(null)
            setModifyTaskWindowOpenType('create')
          }}
        />
      )}
      <ModifyPriorityModal />
      <DeleteConfirmationModal
        apiEndpoint="todo-list/priorities"
        confirmationText="Delete this priority"
        customText="Are you sure you want to delete this priority? The tasks with this priority will not be deleted."
        data={selectedPriority ?? undefined}
        isOpen={deletePriorityConfirmationModalOpen}
        itemName="priority"
        queryKey={['todo-list', 'priorities']}
        onClose={() => {
          setDeletePriorityConfirmationModalOpen(false)
        }}
      />
      <ModifyListModal />
      <DeleteConfirmationModal
        apiEndpoint="todo-list/lists"
        confirmationText="Delete this list"
        customText="Are you sure you want to delete this list? The tasks inside this list will not be deleted."
        data={selectedList ?? undefined}
        isOpen={deleteListConfirmationModalOpen}
        itemName="list"
        queryKey={['todo-list', 'lists']}
        onClose={() => {
          setDeleteListConfirmationModalOpen(false)
        }}
      />
      <ModifyTagModal />
      <DeleteConfirmationModal
        apiEndpoint="todo-list/tags"
        confirmationText="Delete this tag"
        customText="Are you sure you want to delete this tag? The tasks with this tag will not be deleted."
        data={selectedTag ?? undefined}
        isOpen={deleteTagConfirmationModalOpen}
        itemName="tag"
        queryKey={['todo-list', 'tags']}
        onClose={() => {
          setDeleteTagConfirmationModalOpen(false)
        }}
      />
    </>
  )
}

export default TodoListContainer
