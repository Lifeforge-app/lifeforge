import { SidebarTitle, WithQuery } from 'lifeforge-ui'
import { useModalStore } from 'lifeforge-ui'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import ModifyPriorityModal from '@apps/01.Productivity/todoList/modals/ModifyPriorityModal'
import { useTodoListContext } from '@apps/01.Productivity/todoList/providers/TodoListProvider'

import TaskPriorityListItem from './TaskPriorityListItem'

function TaskPriorityList() {
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
        label="priorities"
        namespace="apps.todoList"
      />
      <WithQuery query={prioritiesQuery}>
        {priorities =>
          priorities.length > 0 ? (
            <>
              {priorities.map(item => (
                <TaskPriorityListItem key={item.id} item={item} />
              ))}
            </>
          ) : (
            <p className="text-bg-500 text-center">{t('empty.priorities')}</p>
          )
        }
      </WithQuery>
    </>
  )
}

export default TaskPriorityList
