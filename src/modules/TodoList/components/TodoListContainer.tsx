import { Icon } from '@iconify/react'
import React, { useState } from 'react'
import APIComponentWithFallback from '@components/APIComponentWithFallback'
import DeleteConfirmationModal from '@components/DeleteConfirmationModal'
import EmptyStateScreen from '@components/EmptyStateScreen'
import SearchInput from '@components/SearchInput'
import { useTodoListContext } from '@providers/TodoListProvider'
import ModifyTaskWindow from './ModifyTaskWindow'
import Sidebar from './Sidebar'
import TaskList from './tasks/TaskList'
import TodoListHeader from './TodoListHeader'
import ModifyListModal from '../modals/ModifyListModal'
import ModifyTagModal from '../modals/ModifyTagModal'

function TodoListContainer(): React.ReactElement {
  const {
    entries,
    refreshLists,
    refreshTagsList,
    refreshEntries,
    refreshStatusCounter,
    setModifyTaskWindowOpenType,
    deleteTaskConfirmationModalOpen,
    setDeleteTaskConfirmationModalOpen,
    selectedTask,
    selectedList,
    selectedTag,
    setSelectedTask,
    deleteListConfirmationModalOpen,
    setDeleteListConfirmationModalOpen,
    deleteTagConfirmationModalOpen,
    setDeleteTagConfirmationModalOpen
  } = useTodoListContext()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <>
      <div className="isolate mt-6 flex min-h-0 w-full flex-1">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div className="relative z-10 flex h-full flex-1 flex-col lg:ml-8">
          <TodoListHeader setSidebarOpen={setSidebarOpen} />
          <SearchInput
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            stuffToSearch="tasks"
          />
          <APIComponentWithFallback data={entries}>
            {typeof entries !== 'string' && entries.length > 0 ? (
              <TaskList />
            ) : (
              <EmptyStateScreen
                title="No tasks found"
                description="You can create a new task by clicking the button below."
                icon="tabler:article-off"
                ctaContent="Create a new task"
                setModifyModalOpenType={setModifyTaskWindowOpenType}
              />
            )}
          </APIComponentWithFallback>
        </div>
      </div>
      <ModifyTaskWindow />
      <DeleteConfirmationModal
        apiEndpoint="todo-list/entry/delete"
        isOpen={deleteTaskConfirmationModalOpen}
        onClose={() => {
          setDeleteTaskConfirmationModalOpen(false)
          refreshLists()
          refreshTagsList()
          refreshStatusCounter()
        }}
        data={selectedTask}
        itemName="task"
        updateDataList={refreshEntries}
        nameKey="summary"
      />
      {entries.length > 0 && (
        <button
          onClick={() => {
            setSelectedTask(null)
            setModifyTaskWindowOpenType('create')
          }}
          className="absolute bottom-6 right-6 z-10 flex items-center gap-2 rounded-lg bg-custom-500 p-4 font-semibold uppercase tracking-wider text-bg-100 shadow-lg hover:bg-custom-600 dark:text-bg-800 sm:hidden"
        >
          <Icon
            icon="tabler:plus"
            className="h-6 w-6 shrink-0 transition-all"
          />
        </button>
      )}
      <ModifyListModal />
      <DeleteConfirmationModal
        apiEndpoint="todo-list/list/delete"
        data={selectedList}
        isOpen={deleteListConfirmationModalOpen}
        itemName="list"
        onClose={() => {
          setDeleteListConfirmationModalOpen(false)
        }}
        updateDataList={refreshLists}
        customText="Are you sure you want to delete this list? The tasks inside this list will not be deleted."
      />
      <ModifyTagModal />
      <DeleteConfirmationModal
        apiEndpoint="todo-list/tag/delete"
        data={selectedTag}
        isOpen={deleteTagConfirmationModalOpen}
        itemName="tag"
        onClose={() => {
          setDeleteTagConfirmationModalOpen(false)
        }}
        updateDataList={refreshTagsList}
        customText="Are you sure you want to delete this tag? The tasks with this tag will not be deleted."
      />
    </>
  )
}

export default TodoListContainer
