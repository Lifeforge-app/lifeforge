import { useTranslation } from 'react-i18next'

import { APIFallbackComponent, SidebarTitle } from '@lifeforge/ui'

import { useTodoListContext } from '@modules/TodoList/providers/TodoListProvider'

import TaskTagListItem from './TaskTagListItem'

function TaskTagList({
  setSidebarOpen
}: {
  setSidebarOpen: (value: boolean) => void
}) {
  const { t } = useTranslation('modules.todoList')
  const {
    tags,
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
        namespace="modules.todoList"
      />
      <APIFallbackComponent data={tags}>
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
      </APIFallbackComponent>
    </>
  )
}

export default TaskTagList
