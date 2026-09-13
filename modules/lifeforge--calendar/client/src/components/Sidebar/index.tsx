import { SidebarDivider, SidebarWrapper } from '@lifeforge/ui'

import CalendarList from './components/CalendarList'
import CategoryList from './components/CategoryList'
import MiniCalendar from './components/MiniCalendar'

function Sidebar({
  selectedCalendar,
  setSelectedCalendar,
  selectedCategory,
  setSelectedCategory
}: {
  selectedCalendar: string | null
  setSelectedCalendar: (value: string | null) => void
  selectedCategory: string | null
  setSelectedCategory: (value: string | null) => void
}) {
  return (
    <SidebarWrapper>
      <MiniCalendar />
      <SidebarDivider />
      <CalendarList
        selectedCalendar={selectedCalendar}
        setSelectedCalendar={setSelectedCalendar}
      />
      <SidebarDivider />
      <CategoryList
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />
    </SidebarWrapper>
  )
}

export default Sidebar
