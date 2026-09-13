import { useModuleTranslation } from '@lifeforge/localization'
import {
  Button,
  Flex,
  TagsFilter,
  Text,
  useModuleSidebarState
} from '@lifeforge/ui'

import { useTodoListContext } from '@/providers/TodoListProvider'

function Header() {
  const { t } = useModuleTranslation()
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
    <Flex align="center" justify="between" px="md">
      <Flex direction="column" gap="sm">
        <Text as="h1" size={{ base: '3xl', md: '4xl' }} weight="semibold">
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
          <Text as="span" color="muted" size="base">
            ({entries.length})
          </Text>
        </Text>
        <TagsFilter
          availableFilters={{
            list: {
              data: lists.map(e => ({
                id: e.id,
                label: e.name,
                icon: 'tabler:list',
                color: e.color
              }))
            },
            tag: {
              data: tags.map(e => ({
                label: e.name,
                id: e.id,
                icon: 'tabler:tag'
              }))
            },
            priority: {
              data: priorities.map(e => ({
                id: e.id,
                label: e.name,
                color: e.color,
                icon: 'tabler:adjustments'
              })),
              isColored: true
            }
          }}
          values={{
            tag: filter.tag,
            list: filter.list,
            priority: filter.priority
          }}
          onChange={{
            tag: setFilter.bind(null, 'tag'),
            list: setFilter.bind(null, 'list'),
            priority: setFilter.bind(null, 'priority')
          }}
        />
      </Flex>
      <Flex align="center" gap="lg">
        <Button
          display={{ base: 'none', sm: 'flex' }}
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
          display={{ base: 'flex', xl: 'none' }}
          icon="tabler:menu"
          variant="plain"
          onClick={() => {
            setIsSidebarOpen(true)
          }}
        />
      </Flex>
    </Flex>
  )
}

export default Header
