import { useSearchParams } from 'react-router'

import { SidebarDivider, SidebarItem, SidebarWrapper } from '@lifeforge/ui'

import { useBooksLibraryContext } from '../../providers/BooksLibraryProvider'
import SidebarSection from './components/SidebarSection'

function Sidebar() {
  const [searchParams, setSearchParams] = useSearchParams()
  const {
    miscellaneous: { sidebarOpen, setSidebarOpen }
  } = useBooksLibraryContext()

  return (
    <SidebarWrapper isOpen={sidebarOpen} setOpen={setSidebarOpen}>
      <SidebarItem
        active={Array.from(searchParams.keys()).length === 0}
        icon="tabler:list"
        name="All books"
        namespace="apps.booksLibrary"
        onClick={() => {
          setSearchParams({})
          setSidebarOpen(false)
        }}
      />
      <SidebarItem
        active={searchParams.get('favourite') === 'true'}
        icon="tabler:heart"
        name="Favourite"
        namespace="apps.booksLibrary"
        onClick={() => {
          searchParams.set('favourite', 'true')
          setSearchParams(searchParams)
          setSidebarOpen(false)
        }}
      />
      <SidebarDivider />
      <SidebarSection stuff="categories" />
      <SidebarDivider />
      <SidebarSection stuff="languages" />
      <SidebarDivider />
      <SidebarSection
        fallbackIcon="tabler:file-text"
        hasActionButton={false}
        hasHamburgerMenu={false}
        stuff="fileTypes"
      />
    </SidebarWrapper>
  )
}

export default Sidebar
