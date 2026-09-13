import { SidebarDivider, SidebarItem, SidebarWrapper } from '@lifeforge/ui'

import useFilter from '../../hooks/useFilter'
import CategoriesSection from './components/CategoriesSection'

function Sidebar() {
  const { updateFilter, filter } = useFilter()

  return (
    <SidebarWrapper>
      <SidebarItem
        active={!filter.category}
        icon="tabler:key"
        label="sidebar.all"
        onClick={() => {
          updateFilter('category', null)
        }}
      />
      <SidebarDivider />
      <CategoriesSection />
    </SidebarWrapper>
  )
}

export default Sidebar
