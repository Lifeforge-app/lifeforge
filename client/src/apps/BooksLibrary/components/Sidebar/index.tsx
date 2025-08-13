import { SidebarDivider, SidebarItem, SidebarWrapper } from 'lifeforge-ui'

import { useBooksLibraryContext } from '../../providers/BooksLibraryProvider'
import SidebarSection from './components/SidebarSection'

function Sidebar() {
  const {
    miscellaneous: { sidebarOpen, setSidebarOpen, filter, setFilter }
  } = useBooksLibraryContext()

  return (
    <SidebarWrapper isOpen={sidebarOpen} setOpen={setSidebarOpen}>
      <SidebarItem
        active={Object.values(filter).every(value => !value)}
        icon="tabler:list"
        label="All books"
        namespace="apps.booksLibrary"
        onClick={() => {
          setFilter('collection', null)
          setFilter('fileType', null)
          setFilter('language', null)
          setSidebarOpen(false)
        }}
      />
      <SidebarItem
        active={filter.favourite}
        icon="tabler:heart"
        label="Favourite"
        namespace="apps.booksLibrary"
        onCancelButtonClick={() => {
          setFilter('favourite', false)
          setSidebarOpen(false)
        }}
        onClick={() => {
          setFilter('favourite', true)
          setSidebarOpen(false)
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
