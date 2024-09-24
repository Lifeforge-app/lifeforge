import React from 'react'
import { useNavigate } from 'react-router'
import { useSearchParams } from 'react-router-dom'
import SidebarDivider from '@components/Sidebar/components/SidebarDivider'
import SidebarItem from '@components/Sidebar/components/SidebarItem'
import SidebarWrapper from '@components/Sidebar/components/SidebarWrapper'
import { useProjectsMContext } from '@providers/ProjectsMProvider'
import SidebarSection from './components/SidebarSection'

function Sidebar(): React.ReactElement {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { sidebarOpen, setSidebarOpen } = useProjectsMContext().miscellaneous
  return (
    <SidebarWrapper isOpen={sidebarOpen} setOpen={setSidebarOpen}>
      <SidebarItem
        onClick={() => {
          navigate('/projects-m')
        }}
        active={searchParams.entries().next().done}
        icon="tabler:list"
        name="All Projects"
      />
      <SidebarItem
        icon="tabler:star-filled"
        name="Starred"
        onClick={() => {
          navigate('/projects-m?starred=true')
        }}
        active={searchParams.get('starred') === 'true'}
      />
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
