import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import { QueryWrapper, SidebarTitle } from '@lifeforge/ui'

import { useTodoListContext } from '@apps/TodoList/providers/TodoListProvider'

import { useModalStore } from '../../../../../core/modals/useModalStore'
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
    open('todoList.modifyPriority', {
      type: 'create',
      existedData: null
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
