/* eslint-disable @typescript-eslint/indent */
import React, { useContext } from 'react'
import APIComponentWithFallback from '@components/APIComponentWithFallback'
import { TodoListContext } from '@providers/TodoListProvider'
import SidebarTitle from '@sidebar/components/SidebarTitle'
import TaskTagListItem from './TaskTagListItem'

function TaskTagList({
  setSidebarOpen
}: {
  setSidebarOpen: (value: boolean) => void
}): React.ReactElement {
  const {
    tags,
    setModifyListModalOpenType: setModifyModalOpenType,
    setSelectedList: setSelectedData
  } = useContext(TodoListContext)

  return (
    <>
      <SidebarTitle
        name="Tags"
        actionButtonIcon="tabler:plus"
        actionButtonOnClick={() => {
          setModifyModalOpenType('create')
          setSelectedData(null)
        }}
      />
      <APIComponentWithFallback data={tags}>
        {typeof tags !== 'string' && (
          <>
            {tags.map(item => (
              <TaskTagListItem
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

export default TaskTagList
