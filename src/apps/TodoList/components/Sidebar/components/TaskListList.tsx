import { useTranslation } from 'react-i18next'

import { APIFallbackComponent, SidebarTitle } from '@lifeforge/ui'

import { useTodoListContext } from '@apps/TodoList/providers/TodoListProvider'

import TaskListListItem from './TaskListListItem'

function TaskListList({
  setSidebarOpen
}: {
  setSidebarOpen: (value: boolean) => void
}) {
  const { t } = useTranslation('apps.todoList')
  const {
    setModifyListModalOpenType: setModifyModalOpenType,
    setSelectedPriority: setSelectedData,
    lists
  } = useTodoListContext()

  return (
    <>
      <SidebarTitle
        actionButtonIcon="tabler:plus"
        actionButtonOnClick={() => {
          setModifyModalOpenType('create')
          setSelectedData(null)
        }}
        name="lists"
        namespace="apps.todoList"
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
            <p className="text-bg-500 text-center">{t('empty.lists')}</p>
          )
        }
      </APIFallbackComponent>
    </>
  )
}

export default TaskListList
