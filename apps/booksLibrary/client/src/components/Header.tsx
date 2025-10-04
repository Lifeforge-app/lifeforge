import forgeAPI from '@/utils/forgeAPI'
import { useQuery } from '@tanstack/react-query'
import { Button, HeaderFilter, useModuleSidebarState } from 'lifeforge-ui'

import useFilter from '../hooks/useFilter'

function Header({ itemCount }: { itemCount: number }) {
  const { setIsSidebarOpen } = useModuleSidebarState()

  const collectionsQuery = useQuery(
    forgeAPI.booksLibrary.collections.list.queryOptions()
  )

  const languagesQuery = useQuery(
    forgeAPI.booksLibrary.languages.list.queryOptions()
  )

  const fileTypesQuery = useQuery(
    forgeAPI.booksLibrary.fileTypes.list.queryOptions()
  )

  const {
    searchQuery,
    updateFilter,
    collection,
    favourite,
    fileType,
    language,
    readStatus
  } = useFilter()

  return (
    <div>
      <div className="flex-between flex">
        <h1 className="text-3xl font-semibold">
          {Object.values([
            collection,
            favourite,
            fileType,
            language,
            readStatus
          ]).every(value => !value) && !searchQuery.trim()
            ? 'All'
            : 'Filtered'}{' '}
          Books <span className="text-bg-500 text-base">({itemCount})</span>
        </h1>
        <Button
          className="lg:hidden"
          icon="tabler:menu"
          variant="plain"
          onClick={() => {
            setIsSidebarOpen(true)
          }}
        />
      </div>
      <HeaderFilter
        items={{
          collection: {
            data: collectionsQuery.data ?? []
          },
          fileType: {
            data:
              fileTypesQuery.data?.map(e => ({
                id: e.id,
                name: e.name,
                icon: 'tabler:file-text'
              })) ?? []
          },
          language: {
            data: languagesQuery.data ?? []
          }
        }}
        setValues={{
          collection: value => updateFilter('collection', value || null),
          fileType: value => updateFilter('fileType', value || null),
          language: value => updateFilter('language', value || null)
        }}
        values={{
          collection: collection ?? '',
          fileType: fileType ?? '',
          language: language ?? ''
        }}
      />
    </div>
  )
}

export default Header
