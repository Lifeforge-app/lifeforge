import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import { QueryWrapper, SidebarTitle } from '@lifeforge/ui'
import { useModalStore } from '@lifeforge/ui'

import ModifyTagModal from '@apps/TodoList/modals/ModifyTagModal'
import { useTodoListContext } from '@apps/TodoList/providers/TodoListProvider'

import TaskTagListItem from './TaskTagListItem'

function TaskTagList({
  setSidebarOpen
}: {
  setSidebarOpen: (value: boolean) => void
}) {
  const open = useModalStore(state => state.open)
  const { t } = useTranslation('apps.todoList')
  const { tagsListQuery } = useTodoListContext()

  const handleCreateTag = useCallback(() => {
    open(ModifyTagModal, {
      type: 'create',
      existedData: null
    })
  }, [])

  return (
    <>
      <SidebarTitle
        actionButtonIcon="tabler:plus"
        actionButtonOnClick={handleCreateTag}
        name="Tags"
        namespace="apps.todoList"
      />
      <QueryWrapper query={tagsListQuery}>
        {tags =>
          tags.length > 0 ? (
            <>
              {tags.map(item => (
                <TaskTagListItem
                  key={item.id}
                  item={item}
                  setSidebarOpen={setSidebarOpen}
                />
              ))}
            </>
          ) : (
            <p className="text-bg-500 text-center">{t('empty.tags')}</p>
          )
        }
      </QueryWrapper>
    </>
  )
}

export default TaskTagList
