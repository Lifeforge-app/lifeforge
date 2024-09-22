import React from 'react'
import { useNavigate } from 'react-router'
import SidebarDivider from '@components/Sidebar/components/SidebarDivider'
import SidebarItem from '@components/Sidebar/components/SidebarItem'
import SidebarWrapper from '@components/Sidebar/components/SidebarWrapper'
import { useProjectsMContext } from '@providers/ProjectsMProvider'
import SidebarSection from './components/SidebarSection'

function Sidebar(): React.ReactElement {
  const navigate = useNavigate()
  const { sidebarOpen, setSidebarOpen } = useProjectsMContext().miscellaneous
  return (
    <SidebarWrapper isOpen={sidebarOpen} setOpen={setSidebarOpen}>
      <SidebarItem
        onClick={() => {
          navigate('/projects-m')
        }}
        icon="tabler:list"
        name="All Projects"
      />
      <SidebarItem icon="tabler:star-filled" name="Starred" />
      {(
        ['categories', 'statuses', 'visibilities', 'technologies'] as const
      ).map(stuff => (
        <>
          <SidebarDivider />
          <SidebarSection stuff={stuff} />
        </>
      ))}
    </SidebarWrapper>
  )
}

export default Sidebar
