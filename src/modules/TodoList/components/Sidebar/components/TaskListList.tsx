import { t } from 'i18next'
import React from 'react'
import { SidebarTitle } from '@components/layouts/sidebar'
import APIFallbackComponent from '@components/screens/APIComponentWithFallback'
import { useTodoListContext } from '@providers/TodoListProvider'
import TaskListListItem from './TaskListListItem'

function TaskListList({
  setSidebarOpen
}: {
  setSidebarOpen: (value: boolean) => void
}): React.ReactElement {
  const {
    setModifyListModalOpenType: setModifyModalOpenType,
    setSelectedPriority: setSelectedData,
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
      <APIFallbackComponent data={lists}>
        {lists =>
          lists.length > 0 ? (
            <>
              {lists.map(item => (
                <TaskListListItem
                  key={item.id}
                  item={item}
                  setSidebarOpen={setSidebarOpen}
                />
              ))}
            </>
          ) : (
            <p className="text-center text-bg-500">{t('emptyState.lists')}</p>
          )
        }
      </APIFallbackComponent>
    </>
  )
}

export default TaskListList
