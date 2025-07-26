import { QueryWrapper, SidebarTitle } from 'lifeforge-ui'
import { useModalStore } from 'lifeforge-ui'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import ModifyListModal from '@apps/TodoList/modals/ModifyListModal'
import { useTodoListContext } from '@apps/TodoList/providers/TodoListProvider'

import TaskListListItem from './TaskListListItem'

function TaskListList({
  setSidebarOpen
}: {
  setSidebarOpen: (value: boolean) => void
}) {
  const open = useModalStore(state => state.open)

  const { t } = useTranslation('apps.todoList')

  const { listsQuery } = useTodoListContext()

  const handleCreateList = useCallback(() => {
    open(ModifyListModal, {
      type: 'create',
      initialData: null
    })
  }, [])

  return (
    <>
      <SidebarTitle
        actionButtonIcon="tabler:plus"
        actionButtonOnClick={handleCreateList}
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
