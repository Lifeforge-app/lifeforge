import { Button, HeaderFilter, useModuleSidebarState } from 'lifeforge-ui'
import { useTranslation } from 'react-i18next'

import { useTodoListContext } from '@apps/TodoList/providers/TodoListProvider'

function Header() {
  const { t } = useTranslation('apps.todoList')

  const { setIsSidebarOpen } = useModuleSidebarState()

  const {
    entriesQuery,
    prioritiesQuery,
    listsQuery,
    tagsListQuery,
    setSelectedTask,
    setModifyTaskWindowOpenType,
    filter,
    setFilter
  } = useTodoListContext()

  const entries = entriesQuery.data ?? []

  const priorities = prioritiesQuery.data ?? []

  const lists = listsQuery.data ?? []

  const tags = tagsListQuery.data ?? []

  return (
    <div className="flex-between flex px-4">
      <div className="space-y-4">
        <h1 className="text-3xl font-semibold md:text-4xl">
          {`${t(
            `headers.${(() => {
              const status = filter.status

              const hasFilter =
                filter.list !== null ||
                filter.tag !== null ||
                filter.priority !== null

              if (status === null || status === '') {
                return hasFilter ? 'filtered' : 'all'
              }

              return status === 'today' ? 'todays' : status
            })().toLowerCase()}Tasks`
          )}`.trim()}{' '}
          <span className="text-bg-500 text-base">({entries.length})</span>
        </h1>
        <HeaderFilter
          items={{
            list: {
              data: lists,
              isColored: true
            },
            tag: {
              data: tags.map(e => ({ ...e, icon: 'tabler:tag' }))
            },
            priority: {
              data: priorities.map(e => ({
                ...e,
                icon: 'tabler:adjustments'
              })),
              isColored: true
            }
          }}
          setValues={{
            tag: setFilter.bind(null, 'tag'),
            list: setFilter.bind(null, 'list'),
            priority: setFilter.bind(null, 'priority')
          }}
          values={{
            tag: filter.tag,
            list: filter.list,
            priority: filter.priority
          }}
        />
      </div>
      <div className="flex items-center gap-6">
        <Button
          className="hidden sm:flex"
          icon="tabler:plus"
          tProps={{ item: t('items.task') }}
          onClick={() => {
            setSelectedTask(null)
            setModifyTaskWindowOpenType('create')
          }}
        >
          new
        </Button>
        <Button
          className="xl:hidden"
          icon="tabler:menu"
          variant="plain"
          onClick={() => {
            setIsSidebarOpen(true)
          }}
        />
      </div>
    </div>
  )
}

export default Header
