import React, { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import SidebarDivider from '@components/Sidebar/components/SidebarDivider'
import SidebarItem from '@components/Sidebar/components/SidebarItem'
import SidebarWrapper from '@components/Sidebar/components/SidebarWrapper'
import SidebarSection from './components/SidebarSection'

function Sidebar(): React.ReactElement {
  const [isOpen, setOpen] = useState(true)
  const [searchParams, setSearchParams] = useSearchParams()

  return (
    <SidebarWrapper isOpen={isOpen} setOpen={setOpen}>
      <SidebarItem
        icon="tabler:list"
        name="All books"
        active={Array.from(searchParams.keys()).length === 0}
        onClick={() => {
          setSearchParams({})
        }}
      />
      <SidebarItem
        icon="tabler:heart"
        name="Favourite"
        active={searchParams.get('favourite') === 'true'}
        onClick={() => {
          setSearchParams(searchParams => {
            searchParams.set('favourite', 'true')
            return searchParams
          })
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
