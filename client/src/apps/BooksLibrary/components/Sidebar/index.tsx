import { SidebarDivider, SidebarItem, SidebarWrapper } from 'lifeforge-ui'

import useFilter from '@apps/BooksLibrary/hooks/useFilter'

import SidebarSection from './components/SidebarSection'

function Sidebar() {
  const { updateFilter, collection, favourite, fileType, language } =
    useFilter()

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
      <SidebarSection stuff="collections" />
      <SidebarDivider />
      <SidebarSection stuff="languages" />
      <SidebarDivider />
      <SidebarSection
        fallbackIcon="tabler:file-text"
        hasActionButton={false}
        hasContextMenu={false}
        stuff="fileTypes"
      />
    </SidebarWrapper>
  )
}

export default Sidebar
