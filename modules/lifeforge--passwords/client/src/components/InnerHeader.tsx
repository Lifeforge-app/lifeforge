import { useQuery } from '@tanstack/react-query'

import { useModuleTranslation } from '@lifeforge/localization'
import {
  Button,
  Flex,
  SearchInput,
  TagsFilter,
  Text,
  useModuleSidebarState
} from '@lifeforge/ui'

import { forgeAPI } from '@/manifest'

import useFilter from '../hooks/useFilter'

function InnerHeader({ totalItemsCount }: { totalItemsCount: number }) {
  const { t } = useModuleTranslation()
  const { setIsSidebarOpen } = useModuleSidebarState()
  const categoriesQuery = useQuery(forgeAPI.categories.list.queryOptions())
  const { filter, updateFilter, searchQuery, setSearchQuery } = useFilter()

  return (
    <>
      <Flex align="center" as="header" justify="between">
        <Flex align="baseline" minWidth="0">
          <Text
            truncate
            as="h1"
            size={{ base: '2xl', xl: '3xl' }}
            weight="semibold"
          >
            {filter.category || searchQuery
              ? t('sidebar.filtered')
              : t('sidebar.all')}
          </Text>
          <Text color="muted" ml="sm" mr="xl">
            ({totalItemsCount})
          </Text>
        </Flex>
        <Button
          display={{ base: 'flex', lg: 'none' }}
          icon="tabler:menu"
          variant="plain"
          onClick={() => {
            setIsSidebarOpen(true)
          }}
        />
      </Flex>
      <TagsFilter
        availableFilters={{
          category: {
            data:
              categoriesQuery.data?.map(category => ({
                id: category.id,
                icon: category.icon,
                color: category.color,
                label: category.name
              })) || [],
            isColored: true
          }
        }}
        mt="sm"
        values={{
          category: filter.category
        }}
        onChange={{
          category: value => {
            updateFilter('category', value)
          }
        }}
      />
      <SearchInput
        debounceMs={300}
        mt="md"
        searchTarget="password"
        value={searchQuery}
        onChange={setSearchQuery}
      />
    </>
  )
}

export default InnerHeader
