import { useQuery } from '@tanstack/react-query'

import { Button, Flex, TagsFilter, Text, useModuleSidebarState } from '@lifeforge/ui'

import { forgeAPI } from '@/manifest'

import useFilter from '../hooks/useFilter'

function Header({ itemCount }: { itemCount: number }) {
  const { setIsSidebarOpen } = useModuleSidebarState()
  const collectionsQuery = useQuery(forgeAPI.collections.list.queryOptions())
  const languagesQuery = useQuery(forgeAPI.languages.list.queryOptions())
  const fileTypesQuery = useQuery(forgeAPI.fileTypes.list.queryOptions())

  const {
    searchQuery,
    updateFilter,
    collection,
    favourite,
    fileType,
    language,
    readStatus
  } = useFilter()

  const isFiltered = !Object.values([
    collection,
    favourite,
    fileType,
    language,
    readStatus
  ]).every(value => !value) || !!searchQuery.trim()

  return (
    <Flex direction="column">
      <Flex justify="between">
        <Text as="h1" size="3xl" weight="semibold">
          {isFiltered ? 'Filtered' : 'All'} Books{' '}
          <Text as="span" color="muted" size="base">
            ({itemCount})
          </Text>
        </Text>
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
          collection: {
            data:
              collectionsQuery.data?.map(collection => ({
                id: collection.id,
                label: collection.name,
                icon: 'tabler:books'
              })) ?? []
          },
          fileType: {
            data:
              fileTypesQuery.data?.map(e => ({
                id: e.id,
                label: e.name,
                icon: 'tabler:file-text'
              })) ?? []
          },
          language: {
            data:
              languagesQuery.data?.map(language => ({
                id: language.id,
                label: language.name,
                icon: 'tabler:language'
              })) ?? []
          }
        }}
        values={{
          collection: collection ?? '',
          fileType: fileType ?? '',
          language: language ?? ''
        }}
        onChange={{
          collection: value =>
            updateFilter('collection', (value || null) as string | null),
          fileType: value =>
            updateFilter('fileType', (value || null) as string | null),
          language: value =>
            updateFilter('language', (value || null) as string | null)
        }}
      />
    </Flex>
  )
}

export default Header
