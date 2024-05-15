/* eslint-disable @typescript-eslint/indent */
/* eslint-disable multiline-ternary */
import React, { useContext } from 'react'
import APIComponentWithFallback from '@components/APIComponentWithFallback'
import { TodoListContext } from '@providers/TodoListProvider'
import SidebarTitle from '@sidebar/components/SidebarTitle'
import TaskListListItem from './TaskListListItem'

function TaskListList({
  setSidebarOpen
}: {
  setSidebarOpen: (value: boolean) => void
}): React.ReactElement {
  const {
    setModifyListModalOpenType: setModifyModalOpenType,
    setSelectedList: setSelectedData
  } = useContext(TodoListContext)
  const { lists } = useContext(TodoListContext)

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
