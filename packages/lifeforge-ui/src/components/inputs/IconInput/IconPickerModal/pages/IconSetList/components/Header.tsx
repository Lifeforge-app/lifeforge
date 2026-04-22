// @ts-expect-error: Iconify types are not fully compatible with the current setup
import { collections as importedCollections } from '@iconify/collections'
import { type IconifyInfo } from '@iconify/types'
import { memo, useCallback, useMemo } from 'react'

import { Button, Listbox, ListboxOption, SearchInput } from '@components/inputs'
import { Box, Flex } from '@components/primitives'

const collections: Record<string, IconifyInfo> = importedCollections

function Header({
  searchQuery,
  setSearchQuery,
  setCurrentIconSet,
  selectedCategory,
  setSelectedCategory,
  iconFilterTerm,
  setIconFilterTerm
}: {
  searchQuery: string
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>
  setCurrentIconSet: React.Dispatch<
    React.SetStateAction<{
      iconSet?: string
      search?: string
    } | null>
  >
  selectedCategory: string | null
  setSelectedCategory: React.Dispatch<React.SetStateAction<string | null>>
  iconFilterTerm: string
  setIconFilterTerm: React.Dispatch<React.SetStateAction<string>>
}) {
  const categories = useMemo(
    () => [
      ...new Set(
        Object.values(collections)
          .map(e => e.category)
          .filter(e => e !== undefined)
      )
    ],
    []
  )

  const handleSearchKeyUp = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && searchQuery !== '') {
        setCurrentIconSet({ search: searchQuery })
      }
    },
    [searchQuery, setCurrentIconSet]
  )

  const handleSearchButtonClick = useCallback(() => {
    if (searchQuery !== '') setCurrentIconSet({ search: searchQuery })
  }, [searchQuery, setCurrentIconSet])

  return (
    <>
      <Flex direction={{ base: 'column', sm: 'row' }} gap="sm" width="100%">
        <SearchInput
          bg={{
            base: 'bg-100',
            hover: 'bg-200',
            dark: 'bg-800',
            darkHover: 'bg-700'
          }}
          namespace="common.modals"
          searchTarget="iconPicker.items.icon"
          value={searchQuery}
          onChange={setSearchQuery}
          onKeyUp={handleSearchKeyUp}
        />
        <Button
          icon="tabler:arrow-right"
          iconPosition="end"
          onClick={handleSearchButtonClick}
        >
          Search
        </Button>
      </Flex>
      <Flex direction={{ base: 'column', lg: 'row' }} gap="md" mt="md">
        <Listbox
          bg={{
            base: 'bg-100',
            hover: 'bg-200',
            dark: 'bg-800',
            darkHover: 'bg-700'
          }}
          renderContent={value => value || 'All Categories'}
          value={selectedCategory}
          onChange={value => setSelectedCategory(value)}
        >
          <ListboxOption label="All Categories" value={null} />
          {categories.map(category => (
            <ListboxOption key={category} label={category} value={category} />
          ))}
        </Listbox>
        <Box width={{ base: '100%', lg: '60%', xl: '33.333%' }}>
          <SearchInput
            bg={{
              base: 'bg-100',
              hover: 'bg-200',
              dark: 'bg-800',
              darkHover: 'bg-700'
            }}
            debounceMs={300}
            icon="tabler:filter"
            namespace="common.modals"
            searchTarget="iconPicker.items.iconSet"
            value={iconFilterTerm}
            onChange={setIconFilterTerm}
          />
        </Box>
      </Flex>
    </>
  )
}

export default memo(Header)
