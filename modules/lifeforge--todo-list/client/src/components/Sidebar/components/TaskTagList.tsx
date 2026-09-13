import { useCallback } from 'react'

import { useModuleTranslation } from '@lifeforge/localization'
import { SidebarTitle, Text, WithQuery, useModalStore } from '@lifeforge/ui'

import ModifyTagModal from '@/modals/ModifyTagModal'
import { useTodoListContext } from '@/providers/TodoListProvider'

import TaskTagListItem from './TaskTagListItem'

function TaskTagList() {
  const { open } = useModalStore()
  const { t } = useModuleTranslation()
  const { tagsListQuery } = useTodoListContext()

  const handleCreateTag = useCallback(() => {
    open(ModifyTagModal, {
      type: 'create'
    })
  }, [])

  return (
    <>
      <SidebarTitle
        actionButton={{
          icon: 'tabler:plus',
          onClick: handleCreateTag
        }}
        label="Tags"
      />
      <WithQuery query={tagsListQuery}>
        {tags =>
          tags.length > 0 ? (
            <>
              {tags.map(item => (
                <TaskTagListItem key={item.id} item={item} />
              ))}
            </>
          ) : (
            <Text align="center" color="muted">
              {t('empty.tags')}
            </Text>
          )
        }
      </WithQuery>
    </>
  )
}

export default TaskTagList
