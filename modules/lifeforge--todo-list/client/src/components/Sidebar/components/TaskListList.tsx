import { useCallback } from 'react'

import { useModuleTranslation } from '@lifeforge/localization'
import { SidebarTitle, Text, WithQuery, useModalStore } from '@lifeforge/ui'

import ModifyListModal from '@/modals/ModifyListModal'
import { useTodoListContext } from '@/providers/TodoListProvider'

import TaskListListItem from './TaskListListItem'

function TaskListList() {
  const { open } = useModalStore()
  const { t } = useModuleTranslation()
  const { listsQuery } = useTodoListContext()

  const handleCreateList = useCallback(() => {
    open(ModifyListModal, {
      type: 'create'
    })
  }, [])

  return (
    <>
      <SidebarTitle
        actionButton={{
          icon: 'tabler:plus',
          onClick: handleCreateList
        }}
        label="lists"
      />
      <WithQuery query={listsQuery}>
        {lists =>
          lists.length > 0 ? (
            <>
              {lists.map(item => (
                <TaskListListItem key={item.id} item={item} />
              ))}
            </>
          ) : (
            <Text align="center" color="muted">
              {t('empty.lists')}
            </Text>
          )
        }
      </WithQuery>
    </>
  )
}

export default TaskListList
