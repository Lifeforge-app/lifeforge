import { useTranslation } from 'react-i18next'

import { APIFallbackComponent, SidebarTitle } from '@lifeforge/ui'

import { useTodoListContext } from '@modules/TodoList/providers/TodoListProvider'

import TaskPriorityListItem from './TaskPriorityListItem'

function TaskPriorityList({
  setSidebarOpen
}: {
  setSidebarOpen: (value: boolean) => void
}) {
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
            <p className="text-bg-500 text-center">{t('empty.priorities')}</p>
          )
        }
      </APIFallbackComponent>
    </>
  )
}

export default TaskPriorityList
