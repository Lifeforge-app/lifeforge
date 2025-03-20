import { useTranslation } from 'react-i18next'

import { QueryWrapper, SidebarTitle } from '@lifeforge/ui'

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
    listsQuery
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
      <QueryWrapper query={listsQuery}>
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
      </QueryWrapper>
    </>
  )
}

export default TaskListList
