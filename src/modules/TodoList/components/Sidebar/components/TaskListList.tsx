import React from 'react'
import SidebarTitle from '@components/Sidebar/components/SidebarTitle'
import { useTodoListContext } from '@providers/TodoListProvider'
import TaskListListItem from './TaskListListItem'
import APIComponentWithFallback from '@components/Screens/APIComponentWithFallback'

function TaskListList({
  setSidebarOpen
}: {
  setSidebarOpen: (value: boolean) => void
}): React.ReactElement {
  const {
    setModifyListModalOpenType: setModifyModalOpenType,
    setSelectedList: setSelectedData,
    lists
  } = useTodoListContext()

  return (
    <>
      <SidebarTitle
        name="lists"
        actionButtonIcon="tabler:plus"
        actionButtonOnClick={() => {
          setModifyModalOpenType('create')
          setSelectedData(null)
        }}
      />
      <APIComponentWithFallback data={lists}>
        {typeof lists !== 'string' && (
          <>
            {lists.map(item => (
              <TaskListListItem
                key={item.id}
                item={item}
                setSidebarOpen={setSidebarOpen}
              />
            ))}
          </>
        )}
      </APIComponentWithFallback>
    </>
  )
}

export default TaskListList
