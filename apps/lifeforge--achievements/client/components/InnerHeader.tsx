import { DIFFICULTIES } from '@'
import forgeAPI from '@/utils/forgeAPI'
import { useQuery } from '@tanstack/react-query'
import {
  Button,
  SearchInput,
  TagsFilter,
  useModuleSidebarState
} from 'lifeforge-ui'
import { useTranslation } from 'react-i18next'

import useFilter from '../hooks/useFilter'

function InnerHeader({ totalItemsCount }: { totalItemsCount: number }) {
  const { t } = useTranslation('apps.achievements')

  const { setIsSidebarOpen } = useModuleSidebarState()

  const categoriesQuery = useQuery(
    forgeAPI.achievements.categories.list.queryOptions()
  )

  const { filter, updateFilter, searchQuery, setSearchQuery } = useFilter()

  return (
    <>
      <header className="flex-between flex w-full">
        <div className="flex min-w-0 items-end">
          <h1 className="truncate text-2xl font-semibold xl:text-3xl">
            {t(`headers.${filter.difficulty || 'all'}`)}{' '}
            {filter.category ? `(${t('headers.filtered')})` : ''}
          </h1>
          <span className="text-bg-500 mr-8 ml-2 text-base">
            ({totalItemsCount})
          </span>
        </div>
        <Button
          className="lg:hidden"
          icon="tabler:menu"
          variant="plain"
          onClick={() => {
            setIsSidebarOpen(true)
          }}
        />
      </header>
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
          },
          difficulty: {
            data: Object.entries(DIFFICULTIES).map(([key, color]) => ({
              id: key,
              label: t(`difficulties.${key}`),
              icon: 'tabler:circle-dot',
              color
            })),
            isColored: true
          }
        }}
        values={{
          category: filter.category,
          difficulty: filter.difficulty
        }}
        onChange={{
          category: value => {
            updateFilter('category', value)
          },
          difficulty: value => {
            updateFilter('difficulty', value)
          }
        }}
      />
      <SearchInput
        className="mt-6"
        debounceMs={300}
        namespace="apps.achievements"
        searchTarget="achievement"
        value={searchQuery}
        onChange={setSearchQuery}
      />
    </>
  )
}

export default InnerHeader
