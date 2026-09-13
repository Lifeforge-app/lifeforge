import { useCallback } from 'react'

import { useModuleTranslation } from '@lifeforge/localization'
import { SidebarTitle, Text, WithQuery, useModalStore } from '@lifeforge/ui'

import ModifyPriorityModal from '@/modals/ModifyPriorityModal'
import { useTodoListContext } from '@/providers/TodoListProvider'

import TaskPriorityListItem from './TaskPriorityListItem'

function TaskPriorityList() {
  const { open } = useModalStore()
  const { t } = useModuleTranslation()
  const { prioritiesQuery } = useTodoListContext()

  const handleCreatePriority = useCallback(() => {
    open(ModifyPriorityModal, {
      type: 'create'
    })
  }, [])

  return (
    <>
      <SidebarTitle
        actionButton={{
          icon: 'tabler:plus',
          onClick: handleCreatePriority
        }}
        label="priorities"
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
            <Text align="center" color="muted">
              {t('empty.priorities')}
            </Text>
          )
        }
      </WithQuery>
    </>
  )
}

export default TaskPriorityList
