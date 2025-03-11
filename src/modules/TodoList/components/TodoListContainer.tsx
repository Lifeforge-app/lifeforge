import { useTodoListContext } from '@providers/TodoListProvider'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useSearchParams } from 'react-router'

import {
  APIFallbackComponent,
  DeleteConfirmationModal,
  EmptyStateScreen,
  FAB,
  SearchInput
} from '@lifeforge/ui'

import ModifyListModal from '../modals/ModifyListModal'
import ModifyPriorityModal from '../modals/ModifyPriorityModal'
import ModifyTagModal from '../modals/ModifyTagModal'
import Header from './Header'
import ModifyTaskWindow from './ModifyTaskWindow'
import Sidebar from './Sidebar'
import TaskList from './tasks/TaskList'

function TodoListContainer(): React.ReactElement {
  const { t } = useTranslation('modules.todoList')
  const [searchParams, setSearchParams] = useSearchParams()
  const {
    entries,
    refreshPriorities,
    refreshLists,
    refreshTagsList,
    refreshEntries,
    refreshStatusCounter,
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
            namespace="modules.todoList"
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            stuffToSearch="task"
          />
          <APIFallbackComponent data={entries}>
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
                  namespace="modules.todoList"
                  onCTAClick={setModifyTaskWindowOpenType}
                />
              )
            }
          </APIFallbackComponent>
        </div>
      </div>
      <ModifyTaskWindow />
      <DeleteConfirmationModal
        apiEndpoint="todo-list/entries"
        data={selectedTask}
        isOpen={deleteTaskConfirmationModalOpen}
        itemName="task"
        nameKey="summary"
        updateDataList={refreshEntries}
        onClose={() => {
          setDeleteTaskConfirmationModalOpen(false)
          refreshPriorities()
          refreshLists()
          refreshTagsList()
          refreshStatusCounter()
        }}
      />
      {entries.length > 0 && (
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
        customText="Are you sure you want to delete this priority? The tasks with this priority will not be deleted."
        data={selectedPriority}
        isOpen={deletePriorityConfirmationModalOpen}
        itemName="priority"
        updateDataList={refreshPriorities}
        onClose={() => {
          setDeletePriorityConfirmationModalOpen(false)
        }}
      />
      <ModifyListModal />
      <DeleteConfirmationModal
        apiEndpoint="todo-list/lists"
        customText="Are you sure you want to delete this list? The tasks inside this list will not be deleted."
        data={selectedList}
        isOpen={deleteListConfirmationModalOpen}
        itemName="list"
        updateDataList={refreshLists}
        onClose={() => {
          setDeleteListConfirmationModalOpen(false)
        }}
      />
      <ModifyTagModal />
      <DeleteConfirmationModal
        apiEndpoint="todo-list/tags"
        customText="Are you sure you want to delete this tag? The tasks with this tag will not be deleted."
        data={selectedTag}
        isOpen={deleteTagConfirmationModalOpen}
        itemName="tag"
        updateDataList={refreshTagsList}
        onClose={() => {
          setDeleteTagConfirmationModalOpen(false)
        }}
      />
    </>
  )
}

export default TodoListContainer
