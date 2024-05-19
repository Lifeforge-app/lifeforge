/* eslint-disable @typescript-eslint/indent */
import React from 'react'
import { useTodoListContext } from '@providers/TodoListProvider'
import SidebarTitle from '@sidebar/components/SidebarTitle'
import TaskTagListItem from './TaskTagListItem'
import APIComponentWithFallback from '../../../../../components/Screens/APIComponentWithFallback'

function TaskTagList({
  setSidebarOpen
}: {
  setSidebarOpen: (value: boolean) => void
}): React.ReactElement {
  const {
    tags,
    setModifyListModalOpenType: setModifyModalOpenType,
    setSelectedList: setSelectedData
  } = useTodoListContext()

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
