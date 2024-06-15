import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router'
import FAB from '@components/ButtonsAndInputs/FAB'
import SearchInput from '@components/ButtonsAndInputs/SearchInput'
import DeleteConfirmationModal from '@components/Modals/DeleteConfirmationModal'
import APIComponentWithFallback from '@components/Screens/APIComponentWithFallback'
import EmptyStateScreen from '@components/Screens/EmptyStateScreen'
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

  const { hash } = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    if (hash === '#new') {
      setSelectedTask(null)
      setModifyTaskWindowOpenType('create')
      navigate('/todo-list')
    }
  }, [hash])

  return (
    <>
      <div className="mt-6 flex min-h-0 w-full flex-1">
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
                ctaContent="new task"
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
        <FAB
          onClick={() => {
            setSelectedTask(null)
            setModifyTaskWindowOpenType('create')
          }}
        />
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
