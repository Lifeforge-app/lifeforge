import { useTranslation } from 'react-i18next'

import { QueryWrapper, SidebarTitle } from '@lifeforge/ui'

import { useTodoListContext } from '@apps/TodoList/providers/TodoListProvider'

import TaskPriorityListItem from './TaskPriorityListItem'

function TaskPriorityList({
  setSidebarOpen
}: {
  setSidebarOpen: (value: boolean) => void
}) {
  const { t } = useTranslation('apps.todoList')
  const {
    setModifyPriorityModalOpenType: setModifyModalOpenType,
    setSelectedPriority: setSelectedData,
    prioritiesQuery
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
        namespace="apps.todoList"
      />
      <QueryWrapper query={prioritiesQuery}>
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
      </QueryWrapper>
    </>
  )
}

export default TaskPriorityList
