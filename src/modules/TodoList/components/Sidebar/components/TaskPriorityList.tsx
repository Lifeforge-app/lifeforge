import { t } from 'i18next'
import React from 'react'
import APIFallbackComponent from '@components/Screens/APIComponentWithFallback'
import SidebarTitle from '@components/Sidebar/components/SidebarTitle'
import { useTodoListContext } from '@providers/TodoListProvider'
import TaskPriorityListItem from './TaskPriorityListItem'

function TaskPriorityList({
  setSidebarOpen
}: {
  setSidebarOpen: (value: boolean) => void
}): React.ReactElement {
  const {
    setModifyPriorityModalOpenType: setModifyModalOpenType,
    setSelectedPriority: setSelectedData,
    priorities
  } = useTodoListContext()

  return (
    <>
      <SidebarTitle
        name="priorities"
        actionButtonIcon="tabler:plus"
        actionButtonOnClick={() => {
          setModifyModalOpenType('create')
          setSelectedData(null)
        }}
      />
      <APIFallbackComponent data={priorities}>
        {priorities =>
          priorities.length > 0 ? (
            <>
              {priorities.map(item => (
                <TaskPriorityListItem
                  key={item.id}
                  item={item}
                  setSidebarOpen={setSidebarOpen}
                />
              ))}
            </>
          ) : (
            <p className="text-center text-bg-500">
              {t('emptyState.priority')}
            </p>
          )
        }
      </APIFallbackComponent>
    </>
  )
}

export default TaskPriorityList
