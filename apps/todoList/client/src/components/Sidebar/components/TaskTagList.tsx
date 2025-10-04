import ModifyTagModal from '@/modals/ModifyTagModal'
import { useTodoListContext } from '@/providers/TodoListProvider'
import { SidebarTitle, WithQuery } from 'lifeforge-ui'
import { useModalStore } from 'lifeforge-ui'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import TaskTagListItem from './TaskTagListItem'

function TaskTagList() {
  const open = useModalStore(state => state.open)

  const { t } = useTranslation('apps.todoList')

  const { tagsListQuery } = useTodoListContext()

  const handleCreateTag = useCallback(() => {
    open(ModifyTagModal, {
      type: 'create'
    })
  }, [])

  return (
    <>
      <SidebarTitle
        actionButtonIcon="tabler:plus"
        actionButtonOnClick={handleCreateTag}
        label="Tags"
        namespace="apps.todoList"
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
            <p className="text-bg-500 text-center">{t('empty.tags')}</p>
          )
        }
      </WithQuery>
    </>
  )
}

export default TaskTagList
