import { Icon } from '@iconify/react'
import {
  ContentWrapperWithSidebar,
  LayoutWithSidebar,
  Listbox,
  ListboxOption,
  SearchInput,
  SidebarDivider,
  SidebarItem,
  SidebarTitle,
  SidebarWrapper
} from 'lifeforge-ui'
import { useState } from 'react'

import ModuleCard from '@/components/modules/ModuleCard'
import { CATEGORIES, MODULES } from '@/data/modules'

export default function Registry() {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('Most Popular')

  const filteredModules = MODULES.filter(module => {
    const matchesCategory =
      selectedCategory === 'All' || module.category === selectedCategory
    const matchesSearch =
      module.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      module.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="mt-8 flex min-h-0 w-full min-w-0 flex-1">
      <LayoutWithSidebar>
        <SidebarWrapper>
          <SidebarItem
            active={selectedCategory === 'All'}
            icon="tabler:list"
            label="All Modules"
            number={MODULES.length}
            onClick={() => setSelectedCategory('All')}
            onCancelButtonClick={
              selectedCategory !== 'All'
                ? () => setSelectedCategory('All')
                : undefined
            }
          />
          <SidebarDivider />
          <SidebarTitle label="Categories" />
          {CATEGORIES.filter(cat => cat !== 'All').map(category => (
            <SidebarItem
              key={category}
              active={selectedCategory === category}
              icon="tabler:folder"
              label={category}
              number={MODULES.filter(m => m.category === category).length}
              onClick={() => setSelectedCategory(category)}
              onCancelButtonClick={
                selectedCategory === category
                  ? () => setSelectedCategory('All')
                  : undefined
              }
            />
          ))}
        </SidebarWrapper>
        <ContentWrapperWithSidebar>
          <div className="flex h-full min-h-0 flex-1 flex-col">
            <div className="mb-4 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <h1 className="text-bg-900 dark:text-bg-50 text-3xl font-bold">
                  Browse Modules
                </h1>
                <p className="text-bg-500">
                  Showing {filteredModules.length} results
                  {selectedCategory !== 'All' && ` in ${selectedCategory}`}
                </p>
              </div>
              <Listbox
                value={sortBy}
                onChange={setSortBy}
                className="w-min"
                buttonContent={
                  <div className="flex items-center gap-2">
                    <Icon icon="tabler:sort-descending" className="size-5" />
                    <span className="font-medium">{sortBy}</span>
                  </div>
                }
              >
                <ListboxOption
                  icon="tabler:sort"
                  value="Most Popular"
                  label="Most Popular"
                />
                <ListboxOption
                  icon="tabler:sort"
                  value="Newest"
                  label="Newest"
                />
                <ListboxOption
                  icon="tabler:sort"
                  value="Recently Updated"
                  label="Recently Updated"
                />
                <ListboxOption
                  icon="tabler:sort"
                  value="Alphabetical"
                  label="Alphabetical"
                />
              </Listbox>
            </div>

            <div className="mb-6">
              <SearchInput
                value={searchQuery}
                onChange={setSearchQuery}
                searchTarget="Modules"
                className="min-h-12"
              />
            </div>

            {filteredModules.length > 0 ? (
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
                {filteredModules.map(module => (
                  <ModuleCard key={module.id} module={module} />
                ))}
              </div>
            ) : (
              <div className="border-bg-200 dark:border-bg-800 bg-bg-100/20 dark:bg-bg-900/20 flex flex-1 flex-col items-center justify-center rounded-3xl border border-dashed py-20 text-center">
                <Icon
                  icon="tabler:package-off"
                  className="text-bg-300 dark:text-bg-700 mb-4 h-16 w-16"
                />
                <h3 className="mb-2 text-xl font-bold">No modules found</h3>
                <p className="text-bg-500 mx-auto max-w-xs">
                  Try adjusting your search or category filter to find what
                  you're looking for.
                </p>
                <button
                  className="btn btn-primary btn-sm mt-6"
                  onClick={() => {
                    setSelectedCategory('All')
                    setSearchQuery('')
                  }}
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </ContentWrapperWithSidebar>
      </LayoutWithSidebar>
    </div>
  )
}
