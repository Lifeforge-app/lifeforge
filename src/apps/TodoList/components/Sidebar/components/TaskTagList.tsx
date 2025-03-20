import { useTranslation } from 'react-i18next'

import { QueryWrapper, SidebarTitle } from '@lifeforge/ui'

import { useTodoListContext } from '@apps/TodoList/providers/TodoListProvider'

import TaskTagListItem from './TaskTagListItem'

function TaskTagList({
  setSidebarOpen
}: {
  setSidebarOpen: (value: boolean) => void
}) {
  const { t } = useTranslation('apps.todoList')
  const {
    tagsListQuery,
    setModifyTagModalOpenType: setModifyModalOpenType,
    setSelectedPriority: setSelectedData
  } = useTodoListContext()

  return (
    <>
      <SidebarTitle
        actionButtonIcon="tabler:plus"
        actionButtonOnClick={() => {
          setModifyModalOpenType('create')
          setSelectedData(null)
        }}
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
