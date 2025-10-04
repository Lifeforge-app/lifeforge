import useFilter from '@/hooks/useFilter'
import forgeAPI from '@/utils/forgeAPI'
import { useQuery } from '@tanstack/react-query'
import { SidebarDivider, SidebarItem, SidebarWrapper } from 'lifeforge-ui'

import SidebarSection from './components/SidebarSection'

function Sidebar() {
  const { updateFilter, collection, favourite, fileType, language } =
    useFilter()

  const collectionsQuery = useQuery(
    forgeAPI.booksLibrary.collections.list.queryOptions()
  )

  const languagesQuery = useQuery(
    forgeAPI.booksLibrary.languages.list.queryOptions()
  )

  const fileTypesQuery = useQuery(
    forgeAPI.booksLibrary.fileTypes.list.queryOptions()
  )

  const readStatusQuery = useQuery(
    forgeAPI.booksLibrary.readStatus.list.queryOptions()
  )

  return (
    <SidebarWrapper>
      <SidebarItem
        active={Object.values([
          collection,
          favourite,
          fileType,
          language
        ]).every(value => !value)}
        icon="tabler:list"
        label="All books"
        namespace="apps.booksLibrary"
        onClick={() => {
          updateFilter('collection', null)
          updateFilter('fileType', null)
          updateFilter('language', null)
          updateFilter('favourite', false)
        }}
      />
      <SidebarItem
        active={favourite}
        icon="tabler:heart"
        label="Favourite"
        namespace="apps.booksLibrary"
        onCancelButtonClick={() => {
          updateFilter('favourite', false)
        }}
        onClick={() => {
          updateFilter('favourite', true)
        }}
      />
      <SidebarDivider />
      <SidebarSection
        useNamespace
        dataQuery={readStatusQuery}
        fallbackIcon="tabler:book"
        hasActionButton={false}
        hasContextMenu={false}
        stuff="readStatus"
      />
      <SidebarDivider />
      <SidebarSection dataQuery={collectionsQuery} stuff="collections" />
      <SidebarDivider />
      <SidebarSection dataQuery={languagesQuery} stuff="languages" />
      <SidebarDivider />
      <SidebarSection
        dataQuery={fileTypesQuery}
        fallbackIcon="tabler:file-text"
        hasActionButton={false}
        hasContextMenu={false}
        stuff="fileTypes"
      />
    </SidebarWrapper>
  )
}

export default Sidebar
