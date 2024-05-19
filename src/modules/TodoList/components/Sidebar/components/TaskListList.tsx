/* eslint-disable @typescript-eslint/indent */

import React from 'react'
import APIComponentWithFallback from '@components/APIComponentWithFallback'
import { useTodoListContext } from '@providers/TodoListProvider'
import SidebarTitle from '@sidebar/components/SidebarTitle'
import TaskListListItem from './TaskListListItem'

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
