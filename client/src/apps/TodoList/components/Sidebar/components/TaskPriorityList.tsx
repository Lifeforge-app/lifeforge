import { QueryWrapper, SidebarTitle } from 'lifeforge-ui'
import { useModalStore } from 'lifeforge-ui'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import ModifyPriorityModal from '@apps/TodoList/modals/ModifyPriorityModal'
import { useTodoListContext } from '@apps/TodoList/providers/TodoListProvider'

import TaskPriorityListItem from './TaskPriorityListItem'

function TaskPriorityList({
  setSidebarOpen
}: {
  setSidebarOpen: (value: boolean) => void
}) {
  const open = useModalStore(state => state.open)

  const { t } = useTranslation('apps.todoList')

  const { prioritiesQuery } = useTodoListContext()

  const handleCreatePriority = useCallback(() => {
    open(ModifyPriorityModal, {
      type: 'create'
    })
  }, [])

  return (
    <>
      <SidebarTitle
        actionButtonIcon="tabler:plus"
        actionButtonOnClick={handleCreatePriority}
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
