import React from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  SidebarDivider,
  SidebarItem,
  SidebarWrapper
} from '@components/layouts/sidebar'
import { useBooksLibraryContext } from '@providers/BooksLibraryProvider'
import SidebarSection from './components/SidebarSection'

function Sidebar(): React.ReactElement {
  const [searchParams, setSearchParams] = useSearchParams()
  const {
    miscellaneous: { sidebarOpen, setSidebarOpen }
  } = useBooksLibraryContext()

  return (
    <SidebarWrapper isOpen={sidebarOpen} setOpen={setSidebarOpen}>
      <SidebarItem
        icon="tabler:list"
        name="All books"
        active={Array.from(searchParams.keys()).length === 0}
        onClick={() => {
          setSearchParams({})
          setSidebarOpen(false)
        }}
      />
      <SidebarItem
        icon="tabler:heart"
        name="Favourite"
        active={searchParams.get('favourite') === 'true'}
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
        stuff="fileTypes"
        hasActionButton={false}
        hasHamburgerMenu={false}
      />
    </SidebarWrapper>
  )
}

export default Sidebar
