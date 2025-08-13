import { SidebarDivider, SidebarItem, SidebarWrapper } from 'lifeforge-ui'

import { useBooksLibraryContext } from '../../providers/BooksLibraryProvider'
import SidebarSection from './components/SidebarSection'

function Sidebar() {
  const {
    miscellaneous: { sidebarOpen, setSidebarOpen, selected, setSelected }
  } = useBooksLibraryContext()

  return (
    <SidebarWrapper isOpen={sidebarOpen} setOpen={setSidebarOpen}>
      <SidebarItem
        active={Object.values(selected).every(value => !value)}
        icon="tabler:list"
        label="All books"
        namespace="apps.booksLibrary"
        onClick={() => {
          setSelected('collection', null)
          setSelected('fileType', null)
          setSelected('language', null)
          setSidebarOpen(false)
        }}
      />
      <SidebarItem
        active={selected.favourite}
        icon="tabler:heart"
        label="Favourite"
        namespace="apps.booksLibrary"
        onCancelButtonClick={() => {
          setSelected('favourite', false)
          setSidebarOpen(false)
        }}
        onClick={() => {
          setSelected('favourite', true)
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
