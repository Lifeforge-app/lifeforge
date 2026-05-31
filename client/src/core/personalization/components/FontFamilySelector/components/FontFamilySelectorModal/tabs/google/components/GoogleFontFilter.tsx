import _ from 'lodash'

import {
  Flex,
  Listbox,
  ListboxOption,
  SearchInput,
  surface
} from '@lifeforge/ui'

import { useGoogleFont } from '../contexts/GoogleFontContext'

function GoogleFontFilter() {
  const {
    categories,
    searchQuery,
    selectedCategory,
    setSearchQuery,
    setSelectedCategory
  } = useGoogleFont()

  return (
    <Flex
      align={{ base: 'start', md: 'center' }}
      as="header"
      direction={{ base: 'column', md: 'row' }}
      gap="sm"
    >
      <Listbox
        bg={surface.lightInteractive}
        minWidth={{ base: '100%', md: '14rem' }}
        renderContent={() =>
          _.startCase(selectedCategory || '') || 'All category'
        }
        value={selectedCategory}
        width="min-content"
        onChange={setSelectedCategory}
      >
        <ListboxOption key="all" label="All category" value={null} />
        {categories.map(category => (
          <ListboxOption
            key={category}
            label={_.startCase(category)}
            value={category}
          />
        ))}
      </Listbox>
      <SearchInput
        bg={surface.lightInteractive}
        debounceMs={300}
        namespace="common.personalization"
        searchTarget="fontFamily.items.fontFamily"
        value={searchQuery}
        onChange={setSearchQuery}
      />
    </Flex>
  )
}

export default GoogleFontFilter
