/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/indent */
import React, { useContext, useState } from 'react'
import GoBackButton from '@components/GoBackButton'
import { TodoListContext } from '@providers/TodoListProvider'
import SidebarDivider from '@sidebar/components/SidebarDivider'
import SidebarTitle from '@sidebar/components/SidebarTitle'
import { type ITodoListList } from '@typedec/TodoList'
import TaskListList from './components/TaskListList'
import TaskStatusList from './components/TaskStatusList'
import TaskTagList from './components/TaskTagList'
import ModifyListModal from '../../modals/ModifyListModal'
import ModifyTagModal from '../../modals/ModifyTagModal'

function Sidebar({
  sidebarOpen,
  setSidebarOpen
}: {
  sidebarOpen: boolean
  setSidebarOpen: (value: boolean) => void
}): React.ReactElement {
  const { refreshLists, refreshTagsList } = useContext(TodoListContext)
  const [modifyListModalOpenType, setModifyListModalOpenType] = useState<
    'create' | 'update' | null
  >(null)
  const [modifyTagModalOpenType, setModifyTagModalOpenType] = useState<
    'create' | 'update' | null
  >(null)
  const [existedListData, setExistedSidebarData] =
    useState<ITodoListList | null>(null)

  return (
    <>
      <aside
        className={`absolute ${
          sidebarOpen ? 'left-0' : 'left-full'
        } top-0 z-[9999] h-full w-full overflow-y-scroll rounded-lg bg-bg-50 py-4 shadow-[4px_4px_10px_0px_rgba(0,0,0,0.05)] duration-300 dark:bg-bg-900 lg:static lg:h-[calc(100%-3rem)] lg:w-4/12 xl:w-1/4`}
      >
        <div className="flex items-center justify-between px-8 py-4 lg:hidden">
          <GoBackButton
            onClick={() => {
              setSidebarOpen(false)
            }}
          />
        </div>
        <ul className="flex flex-col overflow-y-hidden hover:overflow-y-scroll">
          <SidebarTitle name="tasks" />
          <TaskStatusList setSidebarOpen={setSidebarOpen} />
          <SidebarDivider />
          <TaskListList
            setSidebarOpen={setSidebarOpen}
            setExistedSidebarData={setExistedSidebarData}
            setModifyListModalOpenType={setModifyListModalOpenType}
          />
          <SidebarDivider />
          <TaskTagList
            setSidebarOpen={setSidebarOpen}
            setExistedSidebarData={setExistedSidebarData}
            setModifyTagModalOpenType={setModifyTagModalOpenType}
          />
        </ul>
      </aside>
      <ModifyListModal
        openType={modifyListModalOpenType}
        setOpenType={setModifyListModalOpenType}
        updateListsList={refreshLists}
        existedData={existedListData}
      />
      <ModifyTagModal
        openType={modifyTagModalOpenType}
        setOpenType={setModifyTagModalOpenType}
        updateTagsList={refreshTagsList}
        existedData={existedListData}
      />
    </>
  )
}

export default Sidebar
