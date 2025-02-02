import React from 'react'
import { useTranslation } from 'react-i18next'
import { SidebarTitle } from '@components/layouts/sidebar'
import APIFallbackComponent from '@components/screens/APIComponentWithFallback'
import { useTodoListContext } from '@providers/TodoListProvider'
import TaskPriorityListItem from './TaskPriorityListItem'

function TaskPriorityList({
  setSidebarOpen
}: {
  setSidebarOpen: (value: boolean) => void
}): React.ReactElement {
  const { t } = useTranslation('modules.todoList')
  const {
    setModifyPriorityModalOpenType: setModifyModalOpenType,
    setSelectedPriority: setSelectedData,
    priorities
  } = useTodoListContext()

  return (
    <>
      <SidebarTitle
        actionButtonIcon="tabler:plus"
        actionButtonOnClick={() => {
          setModifyModalOpenType('create')
          setSelectedData(null)
        }}
        name="priorities"
        namespace="modules.todoList"
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
            <p className="text-center text-bg-500">{t('empty.priorities')}</p>
          )
        }
      </APIFallbackComponent>
    </>
  )
}

export default TaskPriorityList
