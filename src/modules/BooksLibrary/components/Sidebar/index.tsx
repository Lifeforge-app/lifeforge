import React, { useEffect } from 'react'
import SidebarDivider from '@components/Sidebar/components/SidebarDivider'
import SidebarItem from '@components/Sidebar/components/SidebarItem'
import SidebarWrapper from '@components/Sidebar/components/SidebarWrapper'
import { useBooksLibraryContext } from '@providers/BooksLibraryProvider'
import { useGlobalStateContext } from '@providers/GlobalStateProvider'
import SidebarSection from './components/SidebarSection'

function Sidebar(): React.ReactElement {
  const { setSubSidebarExpanded } = useGlobalStateContext()
  const {
    miscellaneous: {
      searchParams,
      setSearchParams,
      sidebarOpen,
      setSidebarOpen
    }
  } = useBooksLibraryContext()

  useEffect(() => {
    setSubSidebarExpanded(sidebarOpen)
  }, [sidebarOpen])

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
    </SidebarWrapper>
  )
}

export default Sidebar
