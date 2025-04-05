import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router'

import { Button, HeaderFilter } from '@lifeforge/ui'

import { useTodoListContext } from '@apps/TodoList/providers/TodoListProvider'

function Header({
  setSidebarOpen
}: {
  setSidebarOpen: (value: boolean) => void
}) {
  const { t } = useTranslation('apps.todoList')
  const {
    entriesQuery,
    prioritiesQuery,
    listsQuery,
    tagsListQuery,
    setSelectedTask,
    setModifyTaskWindowOpenType
  } = useTodoListContext()
  const [searchParams] = useSearchParams()

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
              const status = searchParams.get('status')
              const hasFilter =
                searchParams.has('list') ||
                searchParams.has('tag') ||
                searchParams.has('priority')
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
            setSidebarOpen(true)
          }}
        />
      </div>
    </div>
  )
}

export default Header
