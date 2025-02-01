import React from 'react'
import { useTranslation } from 'react-i18next'
import { SidebarTitle } from '@components/layouts/sidebar'
import APIFallbackComponent from '@components/screens/APIComponentWithFallback'
import { useTodoListContext } from '@providers/TodoListProvider'
import TaskTagListItem from './TaskTagListItem'

function TaskTagList({
  setSidebarOpen
}: {
  setSidebarOpen: (value: boolean) => void
}): React.ReactElement {
  const { t } = useTranslation()
  const {
    tags,
    setModifyTagModalOpenType: setModifyModalOpenType,
    setSelectedPriority: setSelectedData
  } = useTodoListContext()

  return (
    <>
      <SidebarTitle
        name="Tags"
        namespace="modules.todoList"
        actionButtonIcon="tabler:plus"
        actionButtonOnClick={() => {
          setModifyModalOpenType('create')
          setSelectedData(null)
        }}
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
            <p className="text-center text-bg-500">{t('emptyState.tags')}</p>
          )
        }
      </APIFallbackComponent>
    </>
  )
}

export default TaskTagList
