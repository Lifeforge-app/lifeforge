import { t } from 'i18next'
import React from 'react'
import APIFallbackComponent from '@components/Screens/APIComponentWithFallback'
import SidebarTitle from '@components/Sidebar/components/SidebarTitle'
import { useTodoListContext } from '@providers/TodoListProvider'
import TaskTagListItem from './TaskTagListItem'

function TaskTagList({
  setSidebarOpen
}: {
  setSidebarOpen: (value: boolean) => void
}): React.ReactElement {
  const {
    tags,
    setModifyTagModalOpenType: setModifyModalOpenType,
    setSelectedPriority: setSelectedData
  } = useTodoListContext()

  return (
    <>
      <SidebarTitle
        name="Tags"
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
